import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateHugImage = async (
  childImageBase64: string,
  adultImageBase64: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Clean base64 strings if they contain data URI prefixes
  const cleanChild = childImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  const cleanAdult = adultImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `
    Generate a high-quality, realistic, and heartwarming image.
    Input 1 is a reference photo of a person as a child.
    Input 2 is a reference photo of the same person as an adult.
    
    Task: Create a seamless image where the adult person (from Input 2) is affectionately hugging the child version of themselves (from Input 1).
    
    Style: Realistic photography, soft lighting, emotional connection.
    Requirements:
    - The adult should resemble the person in Input 2.
    - The child should resemble the person in Input 1.
    - The pose should be a natural, gentle hug.
    - The background MUST be pure solid white (#FFFFFF).
    - Do not add frames, text, or artifacts.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using Nano Banana model as requested
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanChild,
              mimeType: 'image/jpeg', // Assuming standard image upload, the API handles conversions usually
            },
          },
          {
            inlineData: {
              data: cleanAdult,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image generated in the response.");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
