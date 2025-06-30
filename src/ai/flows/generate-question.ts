// src/ai/flows/generate-question.ts
'use server';
/**
 * @fileOverview A flow to generate cybersecurity quiz questions based on a given topic.
 *
 * - generateQuestion - A function that generates a quiz question.
 * - GenerateQuestionInput - The input type for the generateQuestion function.
 * - GenerateQuestionOutput - The return type for the generateQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionInputSchema = z.object({
  topic: z.string().describe('The cybersecurity topic to generate a question about.'),
});
export type GenerateQuestionInput = z.infer<typeof GenerateQuestionInputSchema>;

const GenerateQuestionOutputSchema = z.object({
  question: z.string().describe('The generated cybersecurity question.'),
  answer: z.string().describe('The answer to the generated question.'),
});
export type GenerateQuestionOutput = z.infer<typeof GenerateQuestionOutputSchema>;

export async function generateQuestion(input: GenerateQuestionInput): Promise<GenerateQuestionOutput> {
  return generateQuestionFlow(input);
}

const generateQuestionPrompt = ai.definePrompt({
  name: 'generateQuestionPrompt',
  input: {schema: GenerateQuestionInputSchema},
  output: {schema: GenerateQuestionOutputSchema},
  prompt: `You are a cybersecurity expert who generates quiz questions on specific topics.

  Generate a single quiz question and its corresponding answer based on the following topic:
  Topic: {{{topic}}}

  Format your response as a JSON object with "question" and "answer" keys.
  `, // Ensure the prompt asks for a JSON format
});

const generateQuestionFlow = ai.defineFlow(
  {
    name: 'generateQuestionFlow',
    inputSchema: GenerateQuestionInputSchema,
    outputSchema: GenerateQuestionOutputSchema,
  },
  async input => {
    const {output} = await generateQuestionPrompt(input);
    return output!;
  }
);
