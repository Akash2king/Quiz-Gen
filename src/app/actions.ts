'use server';

import { generateQuestion } from '@/ai/flows/generate-question';
import { z } from 'zod';

const GenerateQuestionActionSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty.'),
  count: z.coerce.number().int().min(1, 'You must generate at least one question.').max(50, 'Cannot generate more than 50 questions.'),
  level: z.string(),
});

export async function generateQuestionAction(formData: FormData) {
  try {
    const validatedData = GenerateQuestionActionSchema.parse({
      topic: formData.get('topic'),
      count: formData.get('count'),
      level: formData.get('level'),
    });

    const result = await generateQuestion({ topic: validatedData.topic, count: validatedData.count, level: validatedData.level });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const errorMessage = fieldErrors.topic?.[0] || fieldErrors.count?.[0] || fieldErrors.level?.[0] || 'Invalid input provided.';
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Failed to generate question. Please try again.' };
  }
}
