import { Quiz } from '@/components/quiz';
import { GenerateQuestionDialog } from '@/components/generate-question-dialog';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background font-body">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-headline text-primary">
            CyberQuest
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge of cybersecurity. Answer the questions below or generate new ones with AI.
          </p>
        </header>

        <div className="flex justify-center">
          <GenerateQuestionDialog />
        </div>

        <div className="w-full">
          <Quiz />
        </div>
      </div>
    </main>
  );
}
