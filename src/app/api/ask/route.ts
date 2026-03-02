import { NextResponse } from "next/server";
import { openai, QA_SYSTEM_PROMPT } from "@/lib/openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { question, columns, preview, summaryStats } = body;

        if (!question || !columns || !preview) {
            return NextResponse.json(
                { error: "Missing required properties: question, columns, preview." },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY is not configured on the server." },
                { status: 500 }
            );
        }

        const userPrompt = `
Dataset Columns:
${JSON.stringify(columns, null, 2)}

Row Count: ${summaryStats?.rowCount || 'Unknown'}
Column Count: ${summaryStats?.colCount || 'Unknown'}

Sample Data (First 15 rows):
${JSON.stringify(preview.slice(0, 15), null, 2)}

User Question:
"${question}"
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost efficient
            messages: [
                { role: "system", content: QA_SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
        });

        return NextResponse.json({ answer: response.choices[0].message.content });

    } catch (error: any) {
        console.error("QA API Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
