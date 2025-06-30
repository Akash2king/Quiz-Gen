'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { type Question } from '@/lib/questions';
import { generatePdf } from '@/lib/pdf-generator';

interface DownloadPdfDialogProps {
  questions: Question[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DownloadPdfDialog({ questions, isOpen, onOpenChange }: DownloadPdfDialogProps) {
  const [heading, setHeading] = useState('My Awesome Quiz');

  const handleDownload = () => {
    generatePdf(questions, heading);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Quiz as PDF</DialogTitle>
          <DialogDescription>
            Enter a heading for your question paper. The answers will be on the last page.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="heading-input">Paper Heading</Label>
          <Input
            id="heading-input"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g., Weekly Science Test"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} disabled={!heading}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
