// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(req: NextRequest) {
//   try {
//     const { base64Image } = await req.json();
    
//     if (!base64Image) {
//       return NextResponse.json(
//         { error: "No image provided" }, 
//         { status: 400 }
//       );
//     }

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

//     const prompt = `Analyze this person's face and suggest 3 different hairstyles that would suit them.
    
// For each hairstyle, provide:
// - hairstyle_name: Name of the style
// - description: Brief description
// - prompt_for_generation: A detailed prompt for an AI image generator to create this hairstyle (include face preservation instructions)

// Return ONLY valid JSON in this exact format:
// {
//   "hairstyles": [
//     {
//       "hairstyle_name": "",
//       "description": "",
//       "prompt_for_generation": ""
//     }
//   ]
// }`;

//     const imagePart = {
//       inlineData: {
//         data: base64Image,
//         mimeType: "image/png",
//       },
//     };

//     const result = await model.generateContent([prompt, imagePart]);
//     const responseText = result.response.text();
    
//     // Clean response
//     let cleanJson = responseText.trim();
//     if (cleanJson.startsWith("```json")) {
//       cleanJson = cleanJson.replace(/```json\n?/g, "").replace(/```\n?/g, "");
//     }
    
//     const hairstyles = JSON.parse(cleanJson);

//     // Now you would send each prompt to an image generation API
//     // Like Replicate (Stable Diffusion), DALL-E, Midjourney, etc.
    
//     return NextResponse.json(hairstyles, { status: 200 });
    
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Failed to process image", details: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }




// app/api/hair-style/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import * as fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const { base64Image } = await req.json();

    // Convert Base64 to buffer and save temporarily
    const buffer = Buffer.from(base64Image, "base64");
    const tempFilePath = "/tmp/uploaded.jpg";
    await fs.promises.writeFile(tempFilePath, buffer);

    const ai = new GoogleGenAI({});

    // Upload file to Google GenAI
    const myfile = await ai.files.upload({
      file: tempFilePath,
      config: { mimeType: "image/jpeg" },
    });

    // Generate AI images with different hairstyles
    if (!myfile.uri || !myfile.mimeType) {
      throw new Error("File upload failed: missing uri or mimeType");
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Generate 3 different hairstyles on this image, keeping it realistic.",
      ]),
    });

    // Get returned image(s)
    const images =
      response.candidates?.[0]?.content?.parts
        ?.filter(p => p.inlineData)
        ?.map(p => p.inlineData ? p.inlineData.data : null)
        ?.filter((data): data is string => data !== null) || [];

    return NextResponse.json({ images });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" });
  }
}
