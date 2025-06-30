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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, HelpCircle, Loader2 } from 'lucide-react';
import { topics } from '@/lib/topics';
import { generateQuestionAction } from '@/app/actions';
import { type GenerateQuestionOutput } from '@/ai/flows/generate-question';
import { useToast } from '@/hooks/use-toast';

export function GenerateQuestionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [generatedQA, setGeneratedQA] = useState<GenerateQuestionOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTopic('');
      setGeneratedQA(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a topic.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('topic', topic);
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
            Select a cybersecurity topic to generate a new quiz question using AI.
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !topic}>
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
          <div className="mt-4 space-y-4 animate-in fade-in">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertTitle className="font-headline">Question</AlertTitle>
              <AlertDescription>{generatedQA.question}</AlertDescription>
            </Alert>
            <Alert className="border-accent/50">
                <Lightbulb className="h-4 w-4 text-accent-foreground" />
                <AlertTitle className="font-headline">Answer</AlertTitle>
                <AlertDescription>
                    {generatedQA.answer}
                </AlertDescription>
            </Alert>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
