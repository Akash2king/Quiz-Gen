'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { type Question } from '@/lib/questions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Award, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

interface QuizProps {
  questions: Question[];
  onRestart: () => void;
}

export function Quiz({ questions, onRestart }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const [internalQuestions, setInternalQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    const shuffledAndReadyQuestions = questions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setInternalQuestions(shuffledAndReadyQuestions);
    
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizFinished(false);
  }, [questions]);

  const currentQuestion = useMemo(() => {
    return internalQuestions[currentQuestionIndex];
  }, [currentQuestionIndex, internalQuestions]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (currentQuestionIndex < internalQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    onRestart();
  };

  if (internalQuestions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-3d bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center text-muted-foreground">
          Click 'Generate with AI' to start a new quiz!
        </CardContent>
      </Card>
    );
  }

  if (quizFinished) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center shadow-3d animate-in fade-in zoom-in-95 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Award className="mx-auto h-20 w-20 sm:h-24 sm:w-24 text-chart-4" />
          <p className="text-lg">
            Your final score is:
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-primary">
            {score} / {internalQuestions.length}
          </p>
          <p className="text-muted-foreground">
            {score / internalQuestions.length > 0.7 ? "Excellent work! You're a true expert." : "Great effort! Keep learning and try again."}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={handleRestartQuiz}>
            <RotateCw className="mr-2" />
            Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-3d bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <Progress value={((currentQuestionIndex + 1) / internalQuestions.length) * 100} className="mb-4" />
        <CardDescription>
          Question {currentQuestionIndex + 1} of {internalQuestions.length}
        </CardDescription>
        <CardTitle className="font-headline text-xl sm:text-2xl">
          {currentQuestion.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer ?? ''}
          onValueChange={setSelectedAnswer}
          disabled={isAnswered}
        >
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedAnswer;

              return (
                <Label
                  key={index}
                  htmlFor={`option-${index}`}
                  className={cn(
                    "flex items-center p-3 sm:p-4 rounded-lg transition-all duration-150 ease-in-out text-sm sm:text-base",
                    isAnswered ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.02]",
                    isSelected || (isAnswered && (isCorrect || isSelected)) ? 'shadow-3d-inset' : 'shadow-3d',
                    isAnswered && isCorrect && "bg-accent/20 text-accent-foreground font-semibold",
                    isAnswered && isSelected && !isCorrect && "bg-destructive/20 text-destructive-foreground",
                    isAnswered && !isSelected && !isCorrect && "opacity-60"
                  )}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} className="mr-4" />
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-accent" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
                </Label>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-end">
        {isAnswered ? (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex === internalQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        ) : (
          <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
