import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Question } from '@/lib/questions';

// Extend jsPDF with autotable's types
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const generatePdf = (questions: Question[], heading: string) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // 1. Set Main Heading
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const splitHeading = doc.splitTextToSize(heading, doc.internal.pageSize.width - margin * 2);
  doc.text(splitHeading, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  // Start position for the first question
  let yPos = doc.getTextDimensions(splitHeading).h + 30;

  // 2. Add Questions and Options
  questions.forEach((q, index) => {
    const questionText = `${index + 1}. ${q.questionText}`;
    const splitQuestion = doc.splitTextToSize(questionText, doc.internal.pageSize.width - margin * 2);

    // Estimate height needed for the question and its options
    let blockHeight = (doc.getTextDimensions(splitQuestion).h);
    q.options.forEach(opt => {
        const optionText = `   A) ${opt}`;
        blockHeight += doc.getTextDimensions(doc.splitTextToSize(optionText, doc.internal.pageSize.width - margin * 3)).h + 2;
    });
    blockHeight += 10; // Extra space after block

    // Add a new page if the block won't fit
    if (yPos + blockHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(splitQuestion, margin, yPos);
    yPos += doc.getTextDimensions(splitQuestion).h + 5;
    doc.setFont('helvetica', 'normal');

    q.options.forEach((option, i) => {
      const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
      const optionText = `   ${optionLetter}) ${option}`;
      const splitOption = doc.splitTextToSize(optionText, doc.internal.pageSize.width - margin * 2.5);
      doc.text(splitOption, margin + 5, yPos);
      yPos += doc.getTextDimensions(splitOption).h + 2;
    });

    yPos += 10; // Space between questions
  });

  // 3. Add Answer Key on a new page
  doc.addPage();
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Answer Key', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  const answerBody = questions.map((q, index) => {
      const correctOptionIndex = q.options.indexOf(q.correctAnswer);
      const correctOptionLetter = String.fromCharCode(65 + correctOptionIndex);
      return [index + 1, `${correctOptionLetter}) ${q.correctAnswer}`];
  });

  doc.autoTable({
    startY: 30,
    head: [['Q. No.', 'Correct Answer']],
    body: answerBody,
    theme: 'grid',
    headStyles: { 
      fillColor: [44, 62, 80], // Midnight Blue
      textColor: [255, 255, 255]
    },
    styles: {
      font: 'helvetica'
    }
  });


  // 4. Save the PDF
  const safeFileName = heading.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${safeFileName || 'quiz'}_paper.pdf`);
};
