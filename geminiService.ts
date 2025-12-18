
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "./types";

const API_KEY = process.env.API_KEY || "";

const getLangName = (lang: Language) => {
  const langNames = { EN: "English", HI: "Hindi", MR: "Marathi" };
  return langNames[lang];
};

export const getMedicineInfo = async (medicineName: string, lang: Language) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const langName = getLangName(lang);
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find information for the medicine: ${medicineName}. 
    CRITICAL: You must provide all descriptions, warnings, and instructions exclusively in ${langName}. 
    Ensure the terminology is medically accurate but easy to understand for a layperson in ${langName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          usage: { type: Type.STRING, description: "What ailment it is for, translated into the target language" },
          dosage: { type: Type.STRING, description: "Standard dosage instructions, translated into the target language" },
          warning: { type: Type.STRING, description: "Mandatory warning to consult a doctor, translated into the target language" },
        },
        required: ["name", "usage", "dosage", "warning"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const getSymptomAdvice = async (symptoms: string, lang: Language) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const langName = getLangName(lang);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Assess these symptoms or medical emergency: "${symptoms}". 
    CRITICAL: Provide the entire response, including every step and every medication name or description, exclusively in ${langName}.
    Include common cultural context if applicable to the first aid steps in ${langName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          firstAid: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING, description: "Title of the step in the target language" },
                description: { type: Type.STRING, description: "Detailed instruction in the target language" }
              }
            }
          },
          otcSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING, description: "Common OTC medication name and brief purpose in the target language" }
          },
          disclaimer: { type: Type.STRING, description: "A warning that this is AI advice, in the target language" }
        },
        required: ["firstAid", "otcSuggestions", "disclaimer"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const findNearbyPlaces = async (lat: number, lng: number, lang: Language, query: string = "Hospitals and Pharmacies") => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const langName = getLangName(lang);
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find the 3 nearest ${query} to my location. 
    Explain why they are good options in ${langName}.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      },
    },
  });

  return {
    text: response.text,
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getDailyWellness = async (lang: Language) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const langName = getLangName(lang);
  const season = "current season in India";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide 3 daily health tips for: Wellness, Yoga, and Diet, relevant to the ${season}.
    CRITICAL: Every word of the response must be in ${langName}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy title in target language" },
            content: { type: Type.STRING, description: "Detailed advice in target language" },
            category: { type: Type.STRING, enum: ["Wellness", "Yoga", "Diet"] }
          },
          required: ["title", "content", "category"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
