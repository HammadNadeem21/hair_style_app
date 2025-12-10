/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenAI } from "@google/genai";
// import fs from "fs";
// import formidable from "formidable";
// import path from "path";

// // Disable Next.js body parsing (we handle it with formidable)
// export const config = {
// api: {
//     bodyParser: false,
// },
// };

// const GENAI_API_KEY = process.env.GENAI_API_KEY!;

// export async function POST(req: NextRequest) {
// const form = new formidable.IncomingForm();

// // Parse the incoming request
// const data: any = await new Promise((resolve, reject) => {
//     form.parse(req as any, (err, fields, files) => {
//     if (err) reject(err);
//     resolve({ fields, files });
//     });
// });

// const file = data.files?.image;
// if (!file) {
//     return NextResponse.json({ error: "No image provided" }, { status: 400 });
// }

// // Read the uploaded image as buffer
// const imageBuffer = fs.readFileSync(file.filepath);

// // Create Gemini client
// const client = new GoogleGenAI({ apiKey: GENAI_API_KEY });

// const prompt = `
// You are an AI professional virtual hairstylist.

// Your job is to analyze the uploaded image and apply hairstyle modifications ONLY.
// Follow these rules strictly:
// - DO NOT alter face
// - Only change HAIR
// - Return EXACTLY 3 different hairstyles
// - Output as valid JSON with keys: hairstyle_name, description, how_to_apply, image_base64
// `;

// try {
//     const response = await client.models.generateContent({
//     model: "gemini-2.5-flash-image",
//     contents: [imageBuffer, prompt],
//     });

//     // Safe parsing
//     const candidate = response.candidates?.[0];
//     let textOutput = "";
//     let images: string[] = [];

//     if (candidate.content?.parts) {
//     for (const part of candidate.content.parts) {
//         if (part.text) textOutput += part.text + "\n";
//         if (part.inline_data?.data) {
//         const imgBase64 = Buffer.from(part.inline_data.data).toString("base64");
//         images.push(`data:image/png;base64,${imgBase64}`);
//         }
//     }
//     }

//     return NextResponse.json({
//     status: "ok",
//     hairstyle_info: textOutput.trim(),
//     images,
//     });
// } catch (err) {
//     console.error("Gemini API error:", err);
//     return NextResponse.json({ error: "Failed to generate hairstyles" }, { status: 500 });
// }
// }

//     /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenAI } from "@google/genai";
// import fs from "fs";
// import formidable from "formidable";

// export const config = { api: { bodyParser: false } };
// const GENAI_API_KEY = process.env.GENAI_API_KEY!;

// // Helper to detect MIME type from file extension
// function getMimeType(filename: string): string {
//   const ext = filename.toLowerCase().split(".").pop();
//   const mimeTypes: Record<string, string> = {
//     jpg: "image/jpeg",
//     jpeg: "image/jpeg",
//     png: "image/png",
//     gif: "image/gif",
//     webp: "image/webp",
//   };
//   return mimeTypes[ext || ""] || "image/jpeg";
// }

// export async function POST(req: NextRequest) {
//   const form = new formidable.Formidable();
//   let tempFilePath: string | null = null;

//   try {
//    const data: any = await new Promise((resolve, reject) => {
//     form.parse(req as any, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });

//     const file = data.files?.image;
//     if (!file) {
//       return NextResponse.json({ error: "No image provided" }, { status: 400 });
//     }

//     tempFilePath = file.filepath;
//     const imageBuffer = fs.readFileSync(tempFilePath!);
//     const base64Image = imageBuffer.toString("base64");
//     const mimeType = getMimeType(file.originalFilename || "image.jpg");

//     const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });

//     const prompt = `You are an AI professional virtual hairstylist.

// Your job is to analyze the uploaded image and apply hairstyle modifications ONLY.
// Follow these rules strictly:
// - DO NOT alter the face
// - Only change the HAIR style
// - Return EXACTLY 3 different hairstyle suggestions
// - For each hairstyle provide:
//   * hairstyle_name: The name of the hairstyle
//   * description: A brief description
//   * how_to_apply: Steps to achieve this look
// - Output ONLY the 3 hairstyles as a JSON array
// - Do not include images, only text descriptions`;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: [
//         { inlineData: { mimeType, data: base64Image } },
//         prompt,
//       ],
//     });

//     const candidate = response.candidates?.[0];
//     if (!candidate?.content?.parts) {
//       return NextResponse.json(
//         { error: "No response from AI model" },
//         { status: 500 }
//       );
//     }

//     let textOutput = "";

//     for (const part of candidate.content.parts) {
//       if (part.text) {
//         textOutput += part.text;
//       }
//     }

//     if (!textOutput.trim()) {
//       return NextResponse.json(
//         { error: "Empty response from AI model" },
//         { status: 500 }
//       );
//     }

//     // Parse JSON response
//     let hairstyles;
//     try {
//       // Extract JSON from response (in case there's extra text)
//       const jsonMatch = textOutput.match(/\[[\s\S]*\]/);
//       if (jsonMatch) {
//         hairstyles = JSON.parse(jsonMatch[0]);
//       } else {
//         hairstyles = JSON.parse(textOutput);
//       }
//     } catch (parseErr) {
//       console.error("Failed to parse hairstyles JSON:", parseErr);
//       return NextResponse.json(
//         { error: "Invalid response format from AI", raw: textOutput },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       status: "ok",
//       hairstyles,
//       message: "Hairstyles generated successfully",
//     });
//   } catch (err) {
//     console.error("API error:", err);
//     return NextResponse.json(
//       { error: "Failed to generate hairstyles", details: String(err) },
//       { status: 500 }
//     );
//   } finally {
//     // Cleanup temporary file
//     if (tempFilePath && fs.existsSync(tempFilePath)) {
//       try {
//         fs.unlinkSync(tempFilePath);
//       } catch (unlinkErr) {
//         console.warn("Failed to delete temp file:", unlinkErr);
//       }
//     }
//   }
// }

// import { NextRequest } from "next/server";
// import { GoogleGenAI } from "@google/genai";

// // const client = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY! });

// // Fix broken JSON automatically
// function tryFixJSON(text:any) {
//   // Remove backticks
//   text = text.replace(/```json/gi, "").replace(/```/g, "");

//   // Fix broken base64 fields
//   text = text.replace(/"image_base64":\s*"data:image\/png;base64,[^"]*/g, `"image_base64": ""`);

//   // Fix missing quotes before ending }
//   text = text.replace(/"image_base64":\s*""}/g, `"image_base64": "" }`);

//   return text.trim();
// }

// export async function POST(req: NextRequest) {

//     const formData = await req.formData();
//     const imageFile = formData.get("image") as Blob;

//     if (!imageFile) {
//         return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
//     }

//       const arrayBuffer = await imageFile.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   const base64Image = buffer.toString("base64");
//   const mimeType = imageFile.type || "image/png";

//   const client = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY! });

//   const prompt = `
// You are an AI virtual hairstylist.

// Rules:
// - DO NOT modify or change the face.
// - Only modify hair.
// - Keep person identity same.
// - Output exactly 3 hairstyles.
// - Blend hair realistically.
// - Keep lighting consistent.
// - Return only pure JSON.

// Format:
// {
//   "hairstyles": [
//     {
//       "hairstyle_name": "",
//       "description": "",
//       "how_to_apply": "",
//       "image_base64": "data:image/png;base64,xxx"
//     }
//   ]
// }
// Return ONLY valid JSON.
// Do NOT include markdown, do NOT include comments, do NOT include backticks.
// Every field must be valid and complete.
// If you don't have the base64 string, return an empty string "".

// `;

// const response = await client.models.generateContent({
//     model: "gemini-2.5-flash-image",

//   contents: [
//     x
//   ],
// })

// // const response = await client.models.generateContent({
// //   model: "gemini-2.0-pro-exp",
// //   contents: [
// //     { text: prompt },
// //     {
// //       inlineData: {
// //         mimeType,
// //         data: base64Image,
// //       },
// //     },
// //   ],
// //   generationConfig: {
// //     responseMimeType: "application/json",
// //     temperature: 0.7,
// //   },
// // });

//   const candidate = response.candidates?.[0];
//   if (!candidate?.content?.parts) {
//     return new Response(JSON.stringify({ error: "No response from AI" }), { status: 500 });
//   }

//   let textOutput = "";
//   for (const part of candidate.content.parts) {
//     if (part.text) textOutput += part.text;
//   }

//   textOutput = tryFixJSON(textOutput);
//   let hairstyles;
//   try {
//     hairstyles = JSON.parse(textOutput);
//   } catch  {
//     return new Response(JSON.stringify({ error: "Invalid JSON from AI", raw: textOutput }), { status: 500 });
//   }

//   return new Response(JSON.stringify({ status: "ok", hairstyles }), { status: 200 });

// }

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Try to repair common JSON issues returned by models (remove trailing commas, close brackets)
function tryFixJSON(text: string): string {
  if (!text) return text;
  // remove markdown fences
  text = text.replace(/```json|```/gi, "");
  // remove common leading/trailing backticks
  text = text.replace(/(^`+|`+$)/g, "");

  // remove trailing commas before } or ]
  text = text.replace(/,\s*(?=[}\]])/g, "");

  // Try to balance braces/brackets if truncated
  const openBrace = (text.match(/{/g) || []).length;
  const closeBrace = (text.match(/}/g) || []).length;
  const openBracket = (text.match(/\[/g) || []).length;
  const closeBracket = (text.match(/\]/g) || []).length;

  if (openBrace > closeBrace) {
    text += "}".repeat(openBrace - closeBrace);
  }
  if (openBracket > closeBracket) {
    text += "]".repeat(openBracket - closeBracket);
  }

  return text.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const base64Image: string | undefined = body?.base64Image;
    const mimeType: string = body?.mimeType || "image/png";

    if (!base64Image || typeof base64Image !== "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing GENAI_API_KEY");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const instruction = `You are an AI virtual hairstylist.

Rules:
- DO NOT modify or change the face.
- Only modify hair.
- Keep person identity the same.
- Output EXACTLY 3 hairstyles with Ai generated images.
- Blend hair realistically.
- Keep lighting consistent.
- RETURN ONLY valid JSON as the model's TEXT response.

Format (example):
{
  "hairstyles": [
    {
      "hairstyle_name": "Modern Fade",
      "description": "Short faded sides with longer textured top",
      "how_to_apply": "Ask barber for a fade with 1-2 on sides, leave 2-3 inches on top",
      "image_base64": ""
    }
  ]
}

Do NOT include markdown, backticks, or extra commentary. 
Return ONLY the JSON object with 3 hairstyles. 
Every field must be present.`;

    const contents = [
      { text: instruction },
      { inlineData: { mimeType, data: base64Image } },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
    });

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      console.error("No candidate parts in response");
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // Extract text from response parts and collect any inline images
    let textOutput = "";
    const inlineImages: string[] = [];
    for (const part of candidate.content.parts) {
      if (part.text) {
        textOutput += part.text;
      }
      // collect inline image data if present
      if (part.inlineData?.data) {
        const data = part.inlineData.data;
        if (typeof data === "string") {
          inlineImages.push(data.startsWith("data:") ? data : `data:${mimeType};base64,${data}`);
        } else {
          try {
            const buf = Buffer.from(data as any);
            inlineImages.push(`data:${mimeType};base64,${buf.toString("base64")}`);
          } catch (e) {
            console.warn("Failed to decode inline image part", e);
          }
        }
      }
    }

    // Attempt to repair common JSON issues first
    textOutput = tryFixJSON(textOutput);

    if (!textOutput.trim()) {
      console.error("Empty text response from model");
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    // Parse JSON from text output
    let hairstyles: any = null;
    try {
      // Extract JSON object from response (in case there's extra text)
      const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : textOutput;
      const parsed = JSON.parse(jsonText);
      
      // Normalize to hairstyles array
      hairstyles = Array.isArray(parsed) ? parsed : (parsed.hairstyles || parsed);
      
      if (!Array.isArray(hairstyles)) {
        throw new Error("Response is not an array of hairstyles");
      }
    } catch (err) {
      console.error("Failed to parse JSON from model:", err, "raw:", textOutput);
      return NextResponse.json(
        { error: "Invalid JSON from AI", raw: textOutput.substring(0, 500) },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "ok", hairstyles });
  } catch (error) {
    console.error("API error in /api/hairs:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: String(error) },
      { status: 500 }
    );
  }
}
