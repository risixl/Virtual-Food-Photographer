
import { GoogleGenAI, Modality } from "@google/genai";
import { ImageStyle } from '../types';

export const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, data] = dataUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      resolve({ mimeType, data, dataUrl });
    };
    reader.onerror = (error) => reject(error);
  });
};

const getStylePrompt = (style: ImageStyle): string => {
    switch (style) {
        case ImageStyle.RUSTIC_DARK:
            return "The style is rustic and dark, featuring moody lighting, deep shadows, and rich textures. It's set on a dark wood table with vintage, rustic props like aged cutlery and linen napkins. Shot with a professional DSLR camera, creating a dramatic, high-end culinary atmosphere.";
        case ImageStyle.BRIGHT_MODERN:
            return "The style is bright, modern, and airy. It features clean, even lighting, a minimalist aesthetic, and a light-colored background. The dish is presented on a contemporary white plate. The focus is sharp, highlighting the food's fresh ingredients with a sophisticated, clean look.";
        case ImageStyle.SOCIAL_MEDIA:
            return "The style is a vibrant, top-down flat lay, perfect for social media. It features bright, saturated colors and an engaging composition with complementary ingredients or props scattered around the main dish. The shot is dynamic, eye-catching, and designed to look delicious and shareable.";
        default:
            return "A professional, high-quality photograph.";
    }
}

export const generateFoodImage = async (dishName: string, style: ImageStyle): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const fullPrompt = `A stunning, hyper-realistic food photograph of "${dishName}". ${getStylePrompt(style)}`;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '4:3',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("Image generation failed.");
};


export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
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

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("Image editing failed to produce an image.");
};
