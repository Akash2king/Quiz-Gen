// src/ai/flows/generate-question.ts
'use server';
/**
 * @fileOverview A flow to generate cybersecurity quiz questions based on a given topic.
 *
 * - generateQuestion - A function that generates quiz questions.
 * - GenerateQuestionInput - The input type for the generateQuestion function.
 * - GenerateQuestionOutput - The return type for the generateQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionInputSchema = z.object({
  topic: z.string().describe('The cybersecurity topic to generate a question about.'),
  count: z
    .number()
    .optional()
    .default(1)
    .describe('The number of questions to generate. Maximum 50.'),
});
export type GenerateQuestionInput = z.infer<typeof GenerateQuestionInputSchema>;

const QuestionAnswerPairSchema = z.object({
  question: z.string().describe('The generated cybersecurity question.'),
  answer: z.string().describe('The answer to the generated question.'),
});

const GenerateQuestionOutputSchema = z.object({
  questions: z
    .array(QuestionAnswerPairSchema)
    .describe('An array of generated questions and answers.'),
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
  prompt: `You are a cybersecurity expert who generates quiz questions on specific topics.

  Generate {{{count}}} quiz question(s) and their corresponding answers based on the following topic:
  Topic: {{{topic}}}

  Format your response as a JSON object with a "questions" key, which is an array of objects, each containing a "question" and "answer".
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
