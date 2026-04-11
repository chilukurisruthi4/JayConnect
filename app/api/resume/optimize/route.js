import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { baseData, jobDesc, jobTitle } = body;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No Gemini API key found. Checking fallback...");
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment variables." }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Explicitly enforce JSON output mapping for Gemini backend architecture
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are an expert Resume ATS (Applicant Tracking System) Optimizer.
I am providing you a JSON representation of a candidate's resume, and a target Job Title and Job Description.
Please rewrite the candidate's 'bullets', 'summary', and 'skills' explicitly targeting the exact keywords found in the Job Description. Make them sound extremely professional and impactful (use Harvard action verbs).

Target Job Title: ${jobTitle}
Target Job Description:
${jobDesc}

Candidate Base Resume JSON:
${JSON.stringify(baseData)}

Instructions:
1. ONLY return valid JSON mapping EXACTLY to the structure of the input Candidate Resume JSON!
2. Keep the exact same array structures for experience, education, etc. just rigidly rewrite the literal string content inside the bullets/skills/summary fields.
`;

    const result = await model.generateContent(prompt);
    let rawJson = result.response.text();
    
    // Clean up potential markdown formatting just in case
    rawJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();

    const optimizedData = JSON.parse(rawJson);

    return NextResponse.json({
      ...optimizedData,
      jobTitle: jobTitle || optimizedData.jobTitle,
      jobDesc: jobDesc
    });

  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return NextResponse.json({ error: "Optimization failed: " + error.message }, { status: 500 });
  }
}
