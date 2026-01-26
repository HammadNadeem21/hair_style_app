import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Agent, Runner, OpenAIChatCompletionsModel } from "@openai/agents";
import { z } from "zod";

const api_key = process.env.GEMINI_API_KEY;

const AgentOutputSchema = z.object({
    overallScore: z.number().min(0).max(100),
    potentialScore: z.number().min(0).max(100),

    facialBreakdown: z.object({
        symmetry: z.number().min(0).max(100),
        skinQuality: z.number().min(0).max(100),
        jawline: z.number().min(0).max(100),
        eyes: z.number().min(0).max(100),
        hairAppearance: z.number().min(0).max(100),
    }),

    strengths: z.array(z.string()),
    improvementAreas: z.array(z.string()),

    maxxingTips: z.object({
        grooming: z.array(z.string()),
        skincare: z.array(z.string()),
        hairstyle: z.array(z.string()),
        lifestyle: z.array(z.string()),
    }),

    disclaimer: z.string(),
});


export async function POST(req: Request) {

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

Your role is to analyze the user's uploaded image and provide a **presentation-based appearance evaluation**, not a medical or psychological assessment.

Rules you MUST follow:
- Do NOT identify the person or guess identity, ethnicity, age, or gender.
- Do NOT provide medical diagnoses or cosmetic surgery advice.
- Base analysis ONLY on visible presentation factors such as grooming, lighting, facial balance, and styling.
- Scores represent relative visual presentation, not personal worth.
- Be neutral, supportive, and improvement-focused.

Your analysis should include:
1. An overall visual presentation score (0–100)
2. A potential improvement score (0–100)
3. A facial feature breakdown (symmetry, skin quality, jawline, eyes, hair appearance)
4. Clear strengths based on visible features
5. Areas that could be improved with grooming or styling
6. Practical "maxxing-style" tips:
   - Grooming
   - Skincare
   - Hairstyle
   - Lifestyle habits (sleep, posture, hydration, etc.)
7. A short disclaimer clarifying limitations of AI-based visual analysis

Output must strictly follow the provided JSON schema.`,
        outputType: AgentOutputSchema,
    })

    const runner = new Runner(agent);
    const result = await runner.run(agent, `Analyze the uploaded user image below for visual appearance and grooming presentation.
Focus on improvable, non-medical factors only.

Image: ${base64Image}`)

    console.log(result)

    return NextResponse.json({
        success: true,
        message: "Image uploaded successfully",

        result: result.finalOutput,
    });
}