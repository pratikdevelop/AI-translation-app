import { NextResponse } from "next/server";
import { translatorGraph } from "@/lib/translatorGraph";

export async function POST(req: Request) {
    try {
        const { text, targetLanguage } = await req.json();

        if (!text || !targetLanguage) {
            return NextResponse.json(
                { error: "Missing text or targetLanguage" },
                { status: 400 }
            );
        }

        // Run the multi-node graph flow
        const result = await translatorGraph.invoke({
            text,
            targetLanguage,
        });

        return NextResponse.json({
            detectedLanguage: result.detectedLanguage,
            correctedText: result.correctedText,
            translation: result.translation,
        });
    } catch (error: any) {
        console.error("Translation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}