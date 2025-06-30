'use server';

import { generateQuestion } from '@/ai/flows/generate-question';
import { z } from 'zod';

const GenerateQuestionActionSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty.'),
});

export async function generateQuestionAction(formData: FormData) {
  try {
    const validatedData = GenerateQuestionActionSchema.parse({
      topic: formData.get('topic'),
    });

    const result = await generateQuestion({ topic: validatedData.topic });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid topic provided.' };
    }
    return { success: false, error: 'Failed to generate question. Please try again.' };
  }
}
