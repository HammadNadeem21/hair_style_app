/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Agent, Runner, OpenAIChatCompletionsModel } from "@openai/agents";
import { z } from "zod";

const api_key = process.env.GEMINI_API_KEY;

// Increase timeout for Vercel to allow AI processing time
export const maxDuration = 60;

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            // Check if it's a rate limit error
            if (error.status === 429 || error.message?.includes('429')) {
                const delay = initialDelay * Math.pow(2, i);
                console.log(`Rate limited, retrying in ${delay}ms (attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            // If not a rate limit error, throw immediately
            throw error;
        }
    }
    throw lastError;
}

const AgentOutputSchema = z.object({
    isFood: z.boolean().describe("Whether there is identifiable food in the image."),
    mainIngredients: z.array(z.string()).optional().describe("List of main ingredients detected in the food."),
    calories: z.number().int().optional().describe("Estimated total calories."),
    macros: z.object({
        protein: z.string().describe("Protein content (e.g. '20g')"),
        fat: z.string().describe("Fat content (e.g. '10g')"),
        carbs: z.string().describe("Carbohydrate content (e.g. '30g')"),
    }).optional(),
    healthScore: z.number().min(0).max(100).optional().describe("Healthiness score from 0 to 100 based on nutritional value."),
    nutritionalBreakdown: z.string().optional().describe("A brief summary of nutritional content and benefits."),
    warnings: z.array(z.string()).optional().describe("Potential health warnings (e.g., high sugar, high sodium, common allergens)."),
});


export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Image is required" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

        if (!api_key) {
            return NextResponse.json(
                { error: "API key is required" },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: api_key,
            baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        })

        const model = new OpenAIChatCompletionsModel(
            openai,
            "models/gemini-3-pro-preview"
        )
        const agent = new Agent({
            name: "Food_Analysis_Agent",
            model: model,
            instructions: `You are a professional nutritionist and food analysis agent.

Your PRIMARY task is to detect if the image contains food or drink.

Step 1: Detection
- Check if the image contains edible food or drinks.
- If NO food is detected:
  - Set "isFood" to false.
  - DO NOT generate any nutritional analysis.

Step 2: Analysis (ONLY if isFood is true)
- Analyze the user's uploaded food image and provide a nutritional breakdown.
- Estimate the portion size visible in the image.
- Provide:
    1. List of Main Ingredients
    2. Estimated Calories
    3. Macros (Protein, Fat, Carbs) with units
    4. Health Score (0-100) where 100 is very healthy
    5. A brief nutritional breakdown/summary
    6. Any warnings (High Sugar, High Sodium, etc.)

Output must strictly follow the provided JSON schema.`,
            outputType: AgentOutputSchema,
        })

        const runner = new Runner(agent);

        // Retry the AI call with exponential backoff for rate limits
        const result = await retryWithBackoff(async () => {
            return await runner.run(agent, `Analyze the uploaded food image for nutritional information.
Image: ${base64Image}`);
        });

        console.log("Food Analysis Result:", result.finalOutput);

        return NextResponse.json({
            success: true,
            message: "Food image analyzed successfully",
            result: result.finalOutput,
        });
    } catch (error: any) {
        console.error("Food Analysis API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to process food image. Please try again."
            },
            { status: 500 }
        );
    }
}
