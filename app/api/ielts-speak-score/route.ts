import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
const requestSchema = z.object({
    question: z.string().min(1),
    answer: z.string(),
});
export async function POST(req: Request) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }
    try {
        const body = await req.json();
        const parsed = requestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request: question and answer required" }, { status: 400 });
        }
        const { question, answer } = parsed.data;
        const trimmedAnswer = answer.trim();
        if (!trimmedAnswer) {
            return NextResponse.json({ error: "Answer is empty. Record or type your response first." }, { status: 400 });
        }
        const openai = new OpenAI({ apiKey });
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            temperature: 0,
            top_p: 1,
            seed: 42,
            messages: [
                {
                    role: "system",
                    content: `You are a strict IELTS Speaking examiner.

Evaluate the candidate's answer using the official IELTS Speaking band descriptors.

Assess the response based on these four criteria:

1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation (estimate based on naturalness of the sentence structure)

Each criterion must be scored between 0 and 9 using half-band increments (.0 or .5).

Then calculate the final band score as the average of the four scores, rounded to the nearest 0.5.

Important rules:
- Be strict and objective.
- Do not inflate scores.
- Only evaluate the content provided.
- If the answer is short or lacks development, reduce Fluency and Coherence score.
- If vocabulary is simple or repetitive, reduce Lexical Resource score.
- If grammar structures are limited, reduce Grammatical Range score.
- Avoid over-scoring. If unsure between two bands, choose the lower one.

First internally analyze the four criteria step by step.
Then produce the final JSON result.
Do not show the internal reasoning.

Return the result ONLY in JSON format. Do not include explanations outside the JSON.`,
                },
                {
                    role: "user",
                    content: `Question:
${question}

Candidate answer:
${trimmedAnswer}

Evaluate the response and return JSON in the following format:

{
  "fluency_coherence": number,
  "lexical_resource": number,
  "grammar": number,
  "pronunciation": number,
  "overall_band": number,
  "feedback": "short explanation of strengths and weaknesses",
  "improvement": "rewrite the answer at band 6.5-7 level"
}`,
                },
            ],
            response_format: { type: "json_object" },
        });
        const raw = response.choices[0]?.message?.content?.trim();
        if (!raw) {
            return NextResponse.json({ error: "No response from examiner" }, { status: 500 });
        }
        let result: {
            fluency_coherence?: number;
            lexical_resource?: number;
            grammar?: number;
            pronunciation?: number;
            overall_band?: number;
            feedback?: string;
            improvement?: string;
        };
        try {
            result = JSON.parse(raw) as typeof result;
        }
        catch {
            return NextResponse.json({ error: "Invalid examiner response" }, { status: 500 });
        }
        const scoreSource = typeof result.overall_band === "number"
            ? result.overall_band
            : undefined;
        const score = typeof scoreSource === "number"
            ? Math.min(9, Math.max(0, scoreSource))
            : 0;
        const feedback = typeof result.feedback === "string" ? result.feedback : "No feedback provided.";
        return NextResponse.json({
            score,
            feedback,
            breakdown: {
                fluency_coherence: result.fluency_coherence ?? null,
                lexical_resource: result.lexical_resource ?? null,
                grammar: result.grammar ?? null,
                pronunciation: result.pronunciation ?? null,
            },
            improvement: result.improvement ?? null,
        });
    }
    catch (err) {
        console.error("ielts-speak-score error:", err);
        return NextResponse.json({ error: "Could not get score. Try again." }, { status: 500 });
    }
}
