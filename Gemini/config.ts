import { GoogleGenerativeAI } from "@google/generative-ai";

export const AI_MODEL = 'gemini-pro';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: AI_MODEL} );
const PROMPT = process.env.NEXT_PUBLIC_GEMINI_PROMPT!


export { model, PROMPT }