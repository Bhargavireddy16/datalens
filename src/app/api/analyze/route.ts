import { NextResponse } from "next/server";
import { openai, ANALYZE_SYSTEM_PROMPT } from "@/lib/openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { columns, preview } = body;

        if (!columns || !preview) {
            return NextResponse.json(
                { error: "Missing required dataset context (columns, preview)" },
                { status: 400 }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY is not configured on the server." },
                { status: 500 }
            );
        }

        const maxPreviewLength = preview.slice(0, 10); // keep it small for prompt limits
        const userPrompt = `
Here is the dataset structural context:
Columns with types:
${JSON.stringify(columns, null, 2)}

Sample Data (first 10 rows):
${JSON.stringify(maxPreviewLength, null, 2)}

Please generate the required JSON array of 6-10 chart recommendations as per your system instructions. Return ONLY the JSON array.
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost efficient as requested
            messages: [
                { role: "system", content: ANALYZE_SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.1, // Keep it relatively deterministic
            response_format: { type: "json_object" }, // we'll ask for an object with an array to be safer, or just parse
        });

        let content = response.choices[0].message.content || "[]";

        // Quick hack if the API accidentally wrapped it in an object instead of naked JSON array
        try {
            let parsed = JSON.parse(content);
            if (parsed.charts && Array.isArray(parsed.charts)) {
                return NextResponse.json({ charts: parsed.charts });
            }
            if (Array.isArray(parsed)) {
                return NextResponse.json({ charts: parsed });
            }

            // Attempt manual extraction if wrapped differently
            const match = content.match(/\[[\s\S]*\]/);
            if (match) {
                parsed = JSON.parse(match[0]);
                if (Array.isArray(parsed)) {
                    return NextResponse.json({ charts: parsed });
                }
            }

            return NextResponse.json({ charts: [] });
        } catch (err) {
            console.error("OpenAI JSON Parsing Error:", err, "Raw content:", content);
            return NextResponse.json(
                { error: "Failed to parse OpenAI response format." },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Analysis API Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
