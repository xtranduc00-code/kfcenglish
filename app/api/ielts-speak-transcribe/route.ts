import { NextResponse } from "next/server";
import OpenAI from "openai";
const REFINE_MODEL = process.env.IELTS_SPEAK_REFINE_MODEL?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    "gpt-4.1-mini";
async function refineIeltsTranscript(openai: OpenAI, raw: string): Promise<string> {
    const trimmed = raw.trim();
    if (!trimmed)
        return "";
    if (process.env.IELTS_SPEAK_SKIP_REFINE === "1") {
        return trimmed;
    }
    const completion = await openai.chat.completions.create({
        model: REFINE_MODEL,
        temperature: 0.12,
        max_tokens: 2000,
        messages: [
            {
                role: "system",
                content: `You fix automatic speech-to-text for an IELTS Speaking answer. The learner spoke English.

=== MUST FOLLOW ===
1) FIDELITY FIRST: The text must reflect what they actually said—their ideas, order, and rough length. Do NOT add sentences, examples, opinions, or facts they did not say. Do NOT rewrite into a Band-9 sample answer.

2) FIX REAL ERRORS: Correct clear ASR mistakes (wrong homophones, words merged/split wrong, obvious mishearings). Remove obvious stutters/false starts if duplicated. Add light punctuation so it reads naturally.

3) DO NOT "UPGRADE" THEM: Do not replace their simple words with fancy synonyms. Do not fix grammar in a way that changes how they chose to say something. Do not shorten into a summary.

4) SLIGHT LEEWAY ("friendly polish"): Only when two wordings are equally plausible from the noisy text, you may pick the one that sounds slightly clearer or a bit more natural in English—still the same meaning, no new content.

Output: English only. No quotation marks around everything, no "Here is…", no notes.`,
            },
            {
                role: "user",
                content: `Noisy transcript from their voice:\n\n${trimmed}`,
            },
        ],
    });
    const out = completion.choices[0]?.message?.content?.trim();
    return out && out.length > 0 ? out : trimmed;
}
export async function POST(req: Request) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }
    try {
        const form = await req.formData();
        const file = form.get("audio");
        if (!(file instanceof File)) {
            return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
        }
        const openai = new OpenAI({ apiKey });
        const transcription = await openai.audio.transcriptions.create({
            file,
            model: "whisper-1",
            language: "en",
            response_format: "json",
            prompt: "IELTS Speaking. Candidate answers in English.",
        });
        const raw = transcription.text ?? "";
        let text = raw;
        try {
            text = await refineIeltsTranscript(openai, raw);
        }
        catch (refineErr) {
            console.error("ielts-speak-transcribe refine error:", refineErr);
            text = raw;
        }
        return NextResponse.json({ text });
    }
    catch (err) {
        console.error("ielts-speak-transcribe error:", err);
        return NextResponse.json({ error: "Could not transcribe audio. Try again." }, { status: 500 });
    }
}
