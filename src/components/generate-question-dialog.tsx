'use client';

import React, { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lightbulb, HelpCircle, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { generateQuestionAction } from '@/app/actions';
import { type GenerateQuestionOutput } from '@/ai/flows/generate-question';
import { useToast } from '@/hooks/use-toast';
import { type Question } from '@/lib/questions';

interface GenerateQuestionDialogProps {
  onNewQuiz: (questions: Question[]) => void;
}

export function GenerateQuestionDialog({ onNewQuiz }: GenerateQuestionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState('1');
  const [level, setLevel] = useState('Beginner');
  const [generatedQA, setGeneratedQA] = useState<GenerateQuestionOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset all fields on close
      handleClearAndReset();
      setGeneratedQA(null);
    }
  };
  
  const handleCreateQuiz = () => {
    if (generatedQA) {
      onNewQuiz(generatedQA.questions);
      handleOpenChange(false); // Close the dialog
    }
  };

  const handleClearAndReset = () => {
    setGeneratedQA(null);
    setTopic('');
    setCount('1');
    setLevel('Beginner');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic || !count) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a topic and the number of questions.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('count', count);
    formData.append('level', level);
    setGeneratedQA(null);

    startTransition(async () => {
      const result = await generateQuestionAction(formData);
      if (result.success) {
        setGeneratedQA(result.data!);
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
        setGeneratedQA(null);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary/90 hover:bg-primary">
          <Lightbulb className="mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl sm:text-2xl">AI Question Generator</DialogTitle>
          <DialogDescription>
            Enter any topic to generate new quiz questions using AI.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic-input">Topic</Label>
              <Input
                id="topic-input"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Roman History, The Solar System..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="question-count">Number of Questions</Label>
                  <Input
                    id="question-count"
                    name="count"
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    min="1"
                    max="50"
                    placeholder="1-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty-level">Difficulty Level</Label>
                  <Select name="level" value={level} onValueChange={setLevel}>
                    <SelectTrigger id="difficulty-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !topic || !count}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {generatedQA ? 'Re-generate' : 'Generate'}
            </Button>
          </DialogFooter>
        </form>
        {isPending && (
          <div className="mt-4 flex items-center justify-center p-8 rounded-md bg-muted/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating, please wait...</p>
          </div>
        )}
        {generatedQA && generatedQA.questions.length > 0 && (
          <div className="mt-6 space-y-4 animate-in fade-in">
            <div className="max-h-[30vh] overflow-y-auto pr-2 space-y-2">
              <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {generatedQA.questions.map((qa, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <span className="font-headline text-left">Question {index + 1}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Alert>
                          <HelpCircle className="h-4 w-4" />
                          <AlertTitle className="font-headline">Question</AlertTitle>
                          <AlertDescription>{qa.questionText}</AlertDescription>
                        </Alert>
                        <Alert className="border-primary/30">
                          <Lightbulb className="h-4 w-4" />
                          <AlertTitle className="font-headline">Options</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1">
                              {qa.options.map((option, i) => (
                                <li key={i} className={option === qa.correctAnswer ? 'font-bold text-accent-foreground' : ''}>
                                  {option}
                                  {option === qa.correctAnswer && <span className="text-accent font-semibold"> (Correct)</span>}
                                </li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="flex w-full items-center gap-2">
              <Button onClick={handleCreateQuiz} className="flex-grow bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusCircle className="mr-2" />
                Create Quiz with {generatedQA.questions.length} Question{generatedQA.questions.length > 1 ? 's' : ''}
              </Button>
              <Button variant="outline" size="icon" onClick={handleClearAndReset} aria-label="Clear results and reset form">
                  <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
