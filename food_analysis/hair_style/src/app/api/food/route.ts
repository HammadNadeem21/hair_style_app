/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        if (!apiKey) {
            return NextResponse.json({ error: "API key missing" }, { status: 500 });
        }

        // 1. Process Image
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "Image required" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");

        // 2. Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "models/gemini-3-pro-preview",
            generationConfig: {
                temperature: 0.4,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
            }
        });

        // 3. Create the prompt
        const prompt = `You are a professional nutritionist and food analysis expert.

Analyze this food image and provide a comprehensive nutritional breakdown in JSON format.

INSTRUCTIONS:
1. First, determine if the image contains food. If not, set "isFood" to false and stop.
2. If it is food, identify the specific dish name (e.g., "Chicken Biryani", "Caesar Salad").
3. List the main visible ingredients.
4. Estimate the portion size and calculate realistic nutritional values.
5. Provide a health score (0-100) where 100 is very healthy.
6. List any health warnings (high sodium, allergens, etc.).
7. Provide 3-5 actionable tips to improve this meal.

OUTPUT FORMAT (strict JSON):
{
  "isFood": boolean,
  "identifiedDish": "string (dish name)",
  "mainIngredients": ["ingredient1", "ingredient2", ...],
  "calories": number (total calories),
  "macros": {
    "protein": "string with unit (e.g., '25g')",
    "fat": "string with unit (e.g., '15g')",
    "carbs": "string with unit (e.g., '45g')"
  },
  "healthScore": number (0-100),
  "nutritionalBreakdown": "string (brief summary of nutritional content)",
  "warnings": ["warning1", "warning2", ...],
  "improvementTips": ["tip1", "tip2", ...]
}

Be accurate and realistic with your estimates. If unsure about the portion size, assume a standard serving.`;

        // 4. Generate content
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: file.type,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();

        // 5. Parse JSON response
        let analysisResult;
        try {
            analysisResult = JSON.parse(text);
        } catch (error: any) {
            console.error("Failed to parse AI response:", text, error);
            return NextResponse.json(
                { success: false, error: "Invalid AI response format" },
                { status: 500 }
            );
        }

        // 6. Return result
        return NextResponse.json({
            success: true,
            message: "Food analysis complete",
            result: analysisResult,
        });

    } catch (error: any) {
        console.error("Food Analysis Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to analyze food" },
            { status: 500 }
        );
    }
}
