'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { initialQuestions, type Question } from '@/lib/questions';
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

export function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(initialQuestions).map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));
    setQuestions(shuffledQuestions);
  }, []);

  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex];
  }, [currentQuestionIndex, questions]);

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    const shuffledQuestions = shuffleArray(initialQuestions).map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  if (questions.length === 0) {
    return <Card className="w-full max-w-2xl mx-auto"><CardContent className="p-6 text-center text-muted-foreground">Loading Quiz...</CardContent></Card>;
  }

  if (quizFinished) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center shadow-2xl animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Award className="mx-auto h-24 w-24 text-chart-4" />
          <p className="text-xl">
            Your final score is:
          </p>
          <p className="text-5xl font-bold text-primary">
            {score} / {questions.length}
          </p>
          <p className="text-muted-foreground">
            {score / questions.length > 0.7 ? "Excellent work! You're a cybersecurity pro." : "Great effort! Keep learning and try again."}
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
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-4" />
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
        <CardTitle className="font-headline text-2xl">
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
              const variant = isAnswered ? (isCorrect ? 'correct' : isSelected ? 'incorrect' : 'default') : 'default';

              return (
                <Label
                  key={index}
                  htmlFor={`option-${index}`}
                  className={cn(
                    "flex items-center p-4 rounded-md border-2 transition-all",
                    !isAnswered && "cursor-pointer hover:border-primary/80",
                    isAnswered && "cursor-not-allowed",
                    variant === 'default' && "border-border",
                    variant === 'correct' && "border-accent bg-accent/20 text-accent-foreground font-semibold",
                    variant === 'incorrect' && "border-destructive bg-destructive/20 text-destructive-foreground"
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
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
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
