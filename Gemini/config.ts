import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
import { SafetyConfigType } from "./types";

const AI_MODEL = 'gemini-pro';
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: AI_MODEL} );
const PROMPT = process.env.NEXT_PUBLIC_GEMINI_PROMPT!

const SAFETY_CONFIG: SafetyConfigType[] = [
  {
    "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
    "threshold": HarmBlockThreshold.BLOCK_NONE,
  },
  {
    "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    "threshold": HarmBlockThreshold.BLOCK_NONE,
  },
  {
    "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    "threshold": HarmBlockThreshold.BLOCK_NONE,
  },
  {
    "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    "threshold": HarmBlockThreshold.BLOCK_NONE,
  },
  {
    "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    "threshold": HarmBlockThreshold.BLOCK_NONE,
  }
]

export { model, PROMPT, SAFETY_CONFIG }