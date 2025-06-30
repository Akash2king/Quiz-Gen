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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Lightbulb, HelpCircle, Loader2 } from 'lucide-react';
import { topics } from '@/lib/topics';
import { generateQuestionAction } from '@/app/actions';
import { type GenerateQuestionOutput } from '@/ai/flows/generate-question';
import { useToast } from '@/hooks/use-toast';

export function GenerateQuestionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState('1');
  const [generatedQA, setGeneratedQA] = useState<GenerateQuestionOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTopic('');
      setCount('1');
      setGeneratedQA(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic || !count) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a topic and enter the number of questions.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('count', count);
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
          <DialogTitle className="font-headline text-2xl">AI Question Generator</DialogTitle>
          <DialogDescription>
            Select a cybersecurity topic to generate new quiz questions using AI.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic-select" className="text-right">
                Topic
              </Label>
              <div className="col-span-3">
                <Select onValueChange={setTopic} value={topic}>
                  <SelectTrigger id="topic-select">
                    <SelectValue placeholder="Select a topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question-count" className="text-right">
                Number
              </Label>
              <Input
                id="question-count"
                name="count"
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="50"
                className="col-span-3"
                placeholder="1-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !topic || !count}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </DialogFooter>
        </form>
        {isPending && (
          <div className="mt-4 flex items-center justify-center p-8 rounded-md bg-muted/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating, please wait...</p>
          </div>
        )}
        {generatedQA && (
          <div className="mt-6 max-h-[40vh] overflow-y-auto pr-2 space-y-2 animate-in fade-in">
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
                        <AlertDescription>{qa.question}</AlertDescription>
                      </Alert>
                      <Alert className="border-accent/50">
                        <Lightbulb className="h-4 w-4 text-accent-foreground" />
                        <AlertTitle className="font-headline">Answer</AlertTitle>
                        <AlertDescription>{qa.answer}</AlertDescription>
                      </Alert>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
