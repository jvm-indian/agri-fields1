import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from "../types";

// Initialize Gemini
// Note: In a real production app, ensure this is behind a proxy or strict CORS/Referrer policies
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTIONS: Record<Language, string> = {
  en: "You are Krishi Guru, a wise, friendly, and practical farming teacher. Answer simply. Focus on sustainable, organic, and cost-effective farming. If the user asks about crop diseases, be empathetic and precise.",
  hi: "आप कृषि गुरु हैं, एक बुद्धिमान और मित्रवत किसान शिक्षक। सरल हिंदी में उत्तर दें। टिकाऊ और जैविक खेती पर ध्यान दें।",
  te: "మీరు వ్యవసాయ గురువు (Krishi Guru). రైతులకు మిత్రుడు. సరళమైన తెలుగులో సమాధానం ఇవ్వండి.",
  ta: "நீங்கள் விவசாய குரு. எளிய தமிழில் பதில் சொல்லுங்கள்.",
  kn: "ನೀವು ಕೃಷಿ ಗುರು. ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.",
  mr: "तुम्ही कृषी गुरु आहात. सोप्या मराठीत उत्तर द्या."
};

export const chatWithTeacher = async (
  message: string, 
  language: Language, 
  history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "Demo Mode: Gemini API Key is missing. Please check configuration.";
    }

    const modelId = 'gemini-3-flash-preview';
    
    // We construct a fresh request for simplicity in this demo, 
    // but typically you'd maintain a chat session.
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS[language] || SYSTEM_INSTRUCTIONS.en,
        temperature: 0.7,
      }
    });

    return response.text || "I'm thinking... but couldn't find the right words.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Offline Mode: I cannot reach the cloud right now. Please check your connection.";
  }
};

export const analyzeCropImage = async (base64Image: string, language: Language): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "Demo Mode: Cannot analyze image without API Key.";
    }

    // Removing header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analyze this crop image. Identify the crop, potential diseases, and give 3 simple actionable steps to fix it. Respond in ${language} language.`
          }
        ]
      }
    });

    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing image. Please try again.";
  }
};