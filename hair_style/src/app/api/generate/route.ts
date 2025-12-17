/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateWithRetry(model: any, prompt: any, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      // Check for 503 Service Unavailable or 429 Too Many Requests
      if ((error.response?.status === 503 || error.status === 503 || error.message?.includes('503') || error.message?.includes('overloaded')) && i < retries - 1) {
        console.warn(`Attempt ${i + 1} failed with 503/Overloaded. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}

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
    // ----------------------------------------------------------
    // STEP 0: Detect Gender AND Face Shape (TEXT MODEL with Vision)
    // ----------------------------------------------------------
    const analysisModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const analysisPrompt = `
    Analyze this image carefully.
    1. Identify the apparent GENDER (Male or Female).
    2. Identify the FACE SHAPE (e.g., Oval, Round, Square, Diamond, Heart, Oblong, Triangle).
    
    Return the result in this exact JSON format:
    { "gender": "Male/Female", "face_shape": "ShapeName" }
    `;

    const analysisResult = await generateWithRetry(analysisModel, [
      analysisPrompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type || "image/jpeg",
        },
      },
    ]);
    const analysisResponseText = await analysisResult.response.text();

    // Clean and parse the analysis JSON
    let cleanGender = "Male";
    let faceShape = "Oval";

    try {
      const cleanedText = analysisResponseText.replace(/```json|```/g, "").trim();
      const analysisData = JSON.parse(cleanedText);
      cleanGender = analysisData.gender || "Male";
      faceShape = analysisData.face_shape || "Oval";
      console.log("Analysis Result:", { cleanGender, faceShape });
    } catch (e) {
      console.error("Failed to parse analysis JSON, using fallback", e);
      // Fallback simple detection if JSON fails
      if (analysisResponseText.toLowerCase().includes("female")) cleanGender = "Female";
    }


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
You are an expert high-end hairstylist.
User Profile:
- Gender: ${cleanGender}
- Face Shape: ${faceShape}
- Current Preferences: Length: ${hairLength}, Style: ${hairStyle}, Color: ${hairColor}

TASK: Generate exactly 3 distinct hairstyle variations that are SPECIFICALLY SUITABLE for a ${faceShape} face shape.
Do NOT just generate random styles. The styles must significantly improve the user's look based on their face shape.

CRITICAL GENDER REQUIREMENTS:
${cleanGender === 'Male' ? `
- ALL hairstyles MUST be MASCULINE and appropriate for men
- If Long Hair: suggest ONLY masculine long hairstyles (e.g., Man Bun, Rocker Long Hair, Viking Braids, Samurai Topknot, Surfer Waves, Metal/Rock Long Hair)
- AVOID any feminine styling, soft curls, or traditionally female hairstyles
- Focus on strong, bold, masculine aesthetics
` : `
- ALL hairstyles MUST be FEMININE and appropriate for women
- Suggest elegant, stylish feminine hairstyles
`}

FACE SHAPE STRATEGY (${faceShape}):
- If Round: Suggest styles that add height or angles to lengthen the face.
- If Square: Suggest styles that soften the strong jawline.
- If Oval: Suggest versatile styles that maintain balance.
- If Heart: Suggest styles that add volume at the bottom/jawline.
- If Diamond: Suggest styles that minimize cheek width.

Return JSON array ONLY in the following structure:

[
  {
    "hairstyle_name": "string",
    "description": "string (Start with 'Best for ${faceShape} faces because...')",
    "how_to_apply": "string"
  }
]

DO NOT include any explanation outside JSON.
`;

    const textResult = await generateWithRetry(textModel, metadataPrompt);
    const textResponse = await textResult.response;
    console.log("textResponse", textResponse);

    const hairstyleList = JSON.parse(textResponse.text()); // array of 3 objects
    // console.log("res", hairstyleList);

    // Track total tokens used
    let totalTokens = 0;

    // Add tokens from text generation (hairstyle metadata)
    if (textResponse.usageMetadata) {
      totalTokens += textResponse.usageMetadata.totalTokenCount || 0;
    }


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
This is a photo of a ${cleanGender}.
Modify ONLY the hair to match this hairstyle: ${item.hairstyle_name}.
Description: ${item.description}.

CRITICAL CONSTRAINTS - MUST FOLLOW:
1. Keep the face, facial structure, skin tone, and head shape EXACTLY the same
2. ${cleanGender === 'Male' ?
          'PRESERVE MASCULINE FEATURES: Keep strong jawline, masculine bone structure, male eyebrows, and all masculine facial characteristics. DO NOT soften features. DO NOT feminize the face in any way.' :
          'PRESERVE FEMININE FEATURES: Keep feminine facial structure, soft features, and all feminine characteristics.'}
3. Only change the hairstyle - nothing else
4. The hairstyle should be clearly ${cleanGender === 'Male' ? 'MASCULINE and appropriate for men' : 'FEMININE and appropriate for women'}
5. Blend the hair naturally with the existing head shape
6. Generate a high-quality, realistic, photorealistic portrait (8k, highly detailed)
7. Ensure the face is fully visible and front-facing
8. Do NOT change: facial features, eye color, eye shape, nose, lips, skin texture, facial hair, or bone structure

${cleanGender === 'Male' ? 'REMINDER: This MUST look like a MAN with a new hairstyle, NOT a woman. Maintain all masculine characteristics.' : 'REMINDER: This MUST look like a WOMAN with a new hairstyle.'}
`;

      const imgResult = await generateWithRetry(imageModel, [
        imgPrompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: file.type || "image/jpeg",
          },
        },
      ]);

      const imgResponse = await imgResult.response;
      console.log("imgResponse", imgResponse);

      // Add tokens from image generation
      if (imgResponse.usageMetadata) {
        totalTokens += imgResponse.usageMetadata.totalTokenCount || 0;
      }

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

    // Return array of 3 hairstyle objects with total tokens
    return NextResponse.json({
      results: finalOutput,
      totalTokens
    });

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
