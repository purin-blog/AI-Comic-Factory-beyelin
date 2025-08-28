
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerationParams, ComicPage, StoryPage } from '../types';
import { MAX_PAGES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

async function fileToBase64(file: File): Promise<{mimeType: string, data: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      resolve({ mimeType, data });
    };
    reader.onerror = error => reject(error);
  });
}

const storySchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      pageText: {
        type: Type.STRING,
        description: `Narrative text for this comic page. It should describe the scene, action, or dialogue.`,
      },
      imagePrompt: {
        type: Type.STRING,
        description: `A detailed, descriptive prompt for an AI image generator to create the visual for this page. This must be in English.`,
      },
    },
    required: ["pageText", "imagePrompt"],
  },
};

export const generateComicStory = async (params: GenerationParams) => {
  const { prompt, style, customStyle, characterImage, characterDesc, onProgress, onComplete, onError } = params;

  try {
    onProgress('Analyzing your story idea...');

    let detailedCharacterDescription = characterDesc;
    if (characterImage) {
      onProgress('Describing your character from the image...');
      const { mimeType, data } = await fileToBase64(characterImage);
      const imagePart = { inlineData: { mimeType, data } };
      const charPrompt = "Describe the character in this image in detail for an AI image generator. Focus on key visual features like hair, face, clothing, and style to ensure consistency across multiple images. Output a concise description in a single paragraph.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, {text: charPrompt}] },
      });
      detailedCharacterDescription = response.text;
      onProgress('Character description created.');
    } else if (!detailedCharacterDescription) {
      detailedCharacterDescription = "A character as described in the story."
    }

    onProgress('Breaking down the story into pages...');
    const stylePrompt = style === 'custom' ? customStyle : style.replace(/_/g, ' ');
    const storyGenPrompt = `
      You are a master storyteller and comic book writer.
      Your task is to take a user's story prompt and break it down into a coherent, page-by-page narrative for a ${MAX_PAGES}-page comic book.
      
      Story Prompt: "${prompt}"
      
      Character Description: "${detailedCharacterDescription}"
      
      Art Style: "${stylePrompt}"

      Instructions:
      1.  Create a compelling story arc that spans exactly ${MAX_PAGES} pages.
      2.  For each page, write a short narrative text ("pageText").
      3.  For each page, create a highly detailed visual prompt ("imagePrompt") for an AI image generator. This prompt must include:
          - The character described above, ensuring their appearance is consistent.
          - The scene's background and setting.
          - The character's action and emotion.
          - The overall art style of "${stylePrompt}".
      4. Ensure the story is coherent and the narrative progresses logically from one page to the next.
    `;

    const storyResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: storyGenPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: storySchema,
      },
    });

    const storyPages = JSON.parse(storyResponse.text) as StoryPage[];
    
    if (!storyPages || storyPages.length === 0) {
      throw new Error('Failed to generate story pages. The model returned an empty or invalid structure.');
    }

    onProgress('Story pages created. Now generating images...');

    const imageGenerationPromises = storyPages.map((page, index) => {
      onProgress(`Generating image for page ${index + 1}/${MAX_PAGES}...`);
      return ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: page.imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
      }).then(response => ({
        pageNumber: index + 1,
        text: page.pageText,
        imageUrl: `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`,
      }));
    });

    const comicPages = await Promise.all(imageGenerationPromises);
    onProgress('All images generated! Assembling your comic book.');
    onComplete(comicPages.sort((a, b) => a.pageNumber - b.pageNumber));

  } catch (error: any) {
    console.error("Error generating comic:", error);
    onError(error.message || 'An unexpected error occurred during comic generation.');
  }
};
