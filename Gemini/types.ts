import { HarmCategory, HarmBlockThreshold} from "@google/generative-ai";

export type SafetyConfigType = {
  category: HarmCategory;
  threshold: HarmBlockThreshold;
}