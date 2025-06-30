'use client';

import { useState } from 'react';
import { Quiz } from '@/components/quiz';
import { GenerateQuestionDialog } from '@/components/generate-question-dialog';
import { type Question } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleNewQuiz = (newQuestions: Question[]) => {
    setQuestions(shuffleArray(newQuestions));
  };

  const handleRestart = () => {
    setQuestions(shuffleArray(questions));
  }

  const handleClearQuiz = () => {
    setQuestions([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background font-body">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-headline text-primary">
            AI Quiz Generator
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a quiz on any topic you can imagine using the power of AI.
          </p>
        </header>

        <div className="flex justify-center items-center gap-4">
          <GenerateQuestionDialog onNewQuiz={handleNewQuiz} />
          {questions.length > 0 && (
            <Button variant="outline" onClick={handleClearQuiz}>
              <RotateCw className="mr-2 h-4 w-4" />
              Reset Quiz
            </Button>
          )}
        </div>

        <div className="w-full">
          <Quiz questions={questions} onRestart={handleRestart} />
        </div>
      </div>
    </main>
  );
}
