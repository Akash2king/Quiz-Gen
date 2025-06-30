// src/ai/flows/generate-question.ts
'use server';
/**
 * @fileOverview A flow to generate quiz questions based on a given topic.
 *
 * - generateQuestion - A function that generates quiz questions.
 * - GenerateQuestionInput - The input type for the generateQuestion function.
 * - GenerateQuestionOutput - The return type for the generateQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionInputSchema = z.object({
  topic: z.string().describe('The topic to generate a question about.'),
  count: z
    .number()
    .optional()
    .default(1)
    .describe('The number of questions to generate. Maximum 50.'),
  level: z
    .string()
    .optional()
    .default('Beginner')
    .describe('The difficulty level of the questions.'),
});
export type GenerateQuestionInput = z.infer<typeof GenerateQuestionInputSchema>;

const MultipleChoiceQuestionSchema = z.object({
  questionText: z.string().describe('The generated question.'),
  options: z
    .array(z.string())
    .length(4)
    .describe('An array of 4 possible answers (multiple choice).'),
  correctAnswer: z
    .string()
    .describe('The correct answer from the options array.'),
}).refine(data => data.options.includes(data.correctAnswer), {
    message: "Correct answer must be one of the options provided.",
});


const GenerateQuestionOutputSchema = z.object({
  questions: z
    .array(MultipleChoiceQuestionSchema)
    .describe('An array of generated multiple choice questions.'),
});
export type GenerateQuestionOutput = z.infer<typeof GenerateQuestionOutputSchema>;

export async function generateQuestion(
  input: GenerateQuestionInput
): Promise<GenerateQuestionOutput> {
  return generateQuestionFlow(input);
}

const generateQuestionPrompt = ai.definePrompt({
  name: 'generateQuestionPrompt',
  input: {schema: GenerateQuestionInputSchema},
  output: {schema: GenerateQuestionOutputSchema},
  prompt: `You are a helpful assistant who generates multiple choice quiz questions on specific topics.

  Generate {{{count}}} quiz question(s) based on the following topic and difficulty level:
  Topic: {{{topic}}}
  Difficulty: {{{level}}}

  For each question:
  1. Provide a clear question text appropriate for the difficulty level.
  2. Provide exactly 4 multiple choice options.
  3. One of the options must be the correct answer.
  4. Indicate which of the options is the correct answer. The correct answer MUST be present in the options array.

  Format your response as a JSON object with a "questions" key, which is an array of objects, each containing a "questionText", an "options" array, and a "correctAnswer".
  `,
});

const generateQuestionFlow = ai.defineFlow(
  {
    name: 'generateQuestionFlow',
    inputSchema: GenerateQuestionInputSchema,
    outputSchema: GenerateQuestionOutputSchema,
  },
  async input => {
    if (input.count && (input.count > 50 || input.count < 1)) {
      throw new Error('Cannot generate less than 1 or more than 50 questions at a time.');
    }
    const {output} = await generateQuestionPrompt(input);
    return output!;
  }
);
