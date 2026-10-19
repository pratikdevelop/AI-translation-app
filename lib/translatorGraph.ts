import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StateGraph, Annotation } from "@langchain/langgraph";

// 1. Define the updated State Structure
const TranslationState = Annotation.Root({
    text: Annotation<string>,
    targetLanguage: Annotation<string>,
    detectedLanguage: Annotation<string>,
    correctedText: Annotation<string>,
    translation: Annotation<string>,
});

// 2. Initialize NVIDIA LLM
const model = new ChatOpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    configuration: {
        baseURL: "https://integrate.api.nvidia.com/v1",
    },
    model: "meta/llama-3.2-11b-vision-instruct",
    temperature: 0.2,
});

// 3. Node 1: Detect Language and Fix Grammar
async function analyzeAndCorrectNode(state: typeof TranslationState.state) {
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `You are an expert editor and linguist. Analyze the input text and perform two tasks:
1. Fix all grammar, spelling, and phrasing errors.
2. Automatically detect the source language of the input text.

Return your answer strictly in JSON format matching this exact structure:
{{
  "detectedLanguage": "Name of language",
  "correctedText": "The corrected text here"
}}`,
        ],
        ["user", "{text}"],
    ]);

    const chain = prompt.pipe(model);
    const response = await chain.invoke({ text: state.text });

    let responseContent = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

    // Clean potential markdown JSON formatting blocks
    responseContent = responseContent.replace(/```json|```/g, "").trim();

    try {
        const parsed = JSON.parse(responseContent);
        return {
            detectedLanguage: parsed.detectedLanguage || "Unknown",
            correctedText: parsed.correctedText || state.text,
        };
    } catch (err) {
        return {
            detectedLanguage: "Auto-detected",
            correctedText: state.text,
        };
    }
}

// 4. Node 2: Translate the Corrected Text
async function translateNode(state: typeof TranslationState.state) {
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are an expert translator. Translate the given text accurately into {targetLanguage}. Provide ONLY the final translation without any conversational filler or notes.",
        ],
        ["user", "{text}"],
    ]);

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
        targetLanguage: state.targetLanguage,
        text: state.correctedText, // Uses the corrected text from Node 1
    });

    const translationText =
        typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

    return { translation: translationText };
}

// 5. Build the multi-node workflow
const workflow = new StateGraph(TranslationState)
    .addNode("analyzeAndCorrectNode", analyzeAndCorrectNode)
    .addNode("translateNode", translateNode)
    .addEdge("__start__", "analyzeAndCorrectNode")
    .addEdge("analyzeAndCorrectNode", "translateNode")
    .addEdge("translateNode", "__end__");

export const translatorGraph = workflow.compile();