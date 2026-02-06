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
    isHumanFace: z.boolean().describe("Whether a human face is clearly visible in the image."),

    overallScore: z.number().min(0).max(100).optional(),
    potentialScore: z.number().min(0).max(100).optional(),

    facialBreakdown: z.object({
        symmetry: z.number().min(0).max(100),
        skinQuality: z.number().min(0).max(100),
        jawline: z.number().min(0).max(100),
        eyes: z.number().min(0).max(100),
        hairAppearance: z.number().min(0).max(100),
    }).optional(),

    strengths: z.array(z.string()).optional(),
    improvementAreas: z.array(z.string()).optional(),

    maxxingTips: z.object({
        grooming: z.array(z.string()),
        skincare: z.array(z.string()),
        hairstyle: z.array(z.string()),
        lifestyle: z.array(z.string()),
    }).optional(),

    disclaimer: z.string().optional(),
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
            "models/gemini-flash-latest"
        )
        const agent = new Agent({
            name: "Beauty_Facial_Analysis_Agent",
            model: model,
            instructions: `You are a visual appearance and grooming analysis agent inspired by "looksmaxxing" applications.

Your PRIMARY task is to detect if the image contains a real human face.

Step 1: Detection
- Check if the image contains a clear, visible human face.
- Drawings, cartoons, animal faces, or objects are NOT human faces.
- If NO human face is detected:
  - Set "isHumanFace" to false.
  - DO NOT generate any scores or analysis.

Step 2: Analysis (ONLY if isHumanFace is true)
- Analyze the user's uploaded image and provide a **presentation-based appearance evaluation**.
- Rules you MUST follow:
  - Do NOT identify the person or guess identity, ethnicity, age, or gender.
  - Do NOT provide medical diagnoses.
  - Base analysis ONLY on visible presentation factors.
  - Scores represent relative visual presentation.
  - Be neutral, supportive, and improvement-focused.

Your analysis details (if face detected):
1. An overall visual presentation score (0–100)
2. A potential improvement score (0–100)
3. A facial feature breakdown
4. Clear strengths
5. Improvement areas
6. Practical "maxxing-style" tips
7. A short disclaimer

Output must strictly follow the provided JSON schema.`,
            outputType: AgentOutputSchema,
        })

        const runner = new Runner(agent);

        // Retry the AI call with exponential backoff for rate limits
        const result = await retryWithBackoff(async () => {
            return await runner.run(agent, `Analyze the uploaded user image below for visual appearance and grooming presentation.
Focus on improvable, non-medical factors only.

Image: ${base64Image}`);
        });

        console.log(result)

        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
            result: result.finalOutput,
        });
    } catch (error: any) {
        console.error("Glow API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to process image. Please try again."
            },
            { status: 500 }
        );
    }
}