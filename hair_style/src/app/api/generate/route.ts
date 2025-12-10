/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("image") as File;

    const hairLength = formData.get("hair_length") as string;
    const hairStyle = formData.get("hair_style") as string;
    const hairColor = formData.get("hair_color") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Convert image to Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // ----------------------------------------------------------
    // STEP 1: Generate 3 hairstyle metadata objects (TEXT MODEL)
    // ----------------------------------------------------------
    const textModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const metadataPrompt = `
You are an expert hairstylist.

Generate exactly 3 hairstyle variations based on the following user preferences:
- Hair Length: ${hairLength}
- Hair Style: ${hairStyle}
- Hair Color: ${hairColor}

Return JSON array ONLY in the following structure:

[
  {
    "hairstyle_name": "string",
    "description": "string",
    "how_to_apply": "string"
  }
]

DO NOT include any explanation outside JSON.
`;

    const textResult = await textModel.generateContent(metadataPrompt);
    const textResponse = await textResult.response;
    const hairstyleList = JSON.parse(textResponse.text()); // array of 3 objects
    console.log("res", hairstyleList);


    // ----------------------------------------------------------
    // STEP 2: Generate an image for each hairstyle (IMAGE MODEL)
    // ----------------------------------------------------------
    const imageModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
      generationConfig: {
        responseModalities: ["IMAGE"],
      } as any,
    });

    const finalOutput = [];

    for (const item of hairstyleList) {
      const imgPrompt = `
This is a photo of the user.
Modify ONLY the hair.
Apply this hairstyle: ${item.hairstyle_name}.
Description: ${item.description}.
Constraint: Keep the face, skin tone, and head shape exactly the same.
Generate a high-quality, realistic portrait.
Ensure the face is fully visible and front-facing.
Photorealistic, 8k, highly detailed.
Do NOT change facial features, eye color, or skin texture.
Blend the hair naturally with the existing head shape.
`;

      const imgResult = await imageModel.generateContent([
        imgPrompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: file.type || "image/jpeg",
          },
        },
      ]);

      const imgResponse = await imgResult.response;
      const imgPart =
        imgResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;

      if (!imgPart) {
        // If one fails, we might want to continue or throw. 
        // For now, let's just log and continue or push null.
        console.error(`Failed to generate image for ${item.hairstyle_name}`);
        finalOutput.push({
          ...item,
          image: null
        });
        continue;
      }

      finalOutput.push({
        ...item,
        image: `data:image/png;base64,${imgPart.data}`,
      });
    }

    // Return array of 3 hairstyle objects
    return NextResponse.json({ results: finalOutput });

  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    if (error.response) {
      console.error("Error Response:", error.response);
    }
    return NextResponse.json(
      { error: error.message || "Failed to generate 3 hairstyles" },
      { status: 500 }
    );
  }
}
