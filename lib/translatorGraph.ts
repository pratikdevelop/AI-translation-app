import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { detect, translateText, correctGrammar } from "./riva";
import { LANGUAGES, TONES } from "./languages";
export { LANGUAGES, TONES };

const State = Annotation.Root({
  text: Annotation<string>,
  targetLanguage: Annotation<string>,
  tone: Annotation<string>,
  fixGrammar: Annotation<boolean>,
  sourceCode: Annotation<string>,
  detectedLanguage: Annotation<string>,
  correctedText: Annotation<string>,
  translation: Annotation<string>,
});

async function detectNode(s: typeof State.State) {
  const d = detect(s.text);
  return { sourceCode: d.code, detectedLanguage: d.name, correctedText: s.text };
}

async function correctNode(s: typeof State.State) {
  return { correctedText: await correctGrammar(s.text, s.detectedLanguage) };
}

async function translateNode(s: typeof State.State) {
  return { translation: await translateText(s.correctedText || s.text, s.sourceCode, s.targetLanguage) };
}

export const translatorGraph = new StateGraph(State)
  .addNode("detect", detectNode)
  .addNode("correct", correctNode)
  .addNode("translate", translateNode)
  .addEdge(START, "detect")
  .addConditionalEdges("detect", (s) => (s.fixGrammar ? "correct" : "translate"))
  .addEdge("correct", "translate")
  .addEdge("translate", END)
  .compile();