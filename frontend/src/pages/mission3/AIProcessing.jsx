import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Card from '../../components/common/Card.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { ProgressBar } from '../../components/ui/Progress.jsx';
import ProcessingSteps from '../../components/mission3/ProcessingSteps.jsx';
import { PROCESSING_STEPS } from '../../mocks/data/mission3.js';
import { Sparkles } from 'lucide-react';

export default function AIProcessing() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((s) => (s < PROCESSING_STEPS.length - 1 ? s + 1 : s));
    }, 1400);
    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 98 ? p + 2 : p));
    }, 140);
    const done = setTimeout(() => navigate('/mission-3/summary'), PROCESSING_STEPS.length * 1400 + 400);
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(done);
    };
  }, [navigate]);

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <Card className="relative overflow-hidden p-6 sm:p-10">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl animate-pulse" />

          <div className="relative flex flex-col items-center text-center gap-4 mb-8">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-2xl bg-brand text-brand-fg flex items-center justify-center animate-pulse">
                <Sparkles size={24} />
              </div>
              <div className="absolute -inset-2 rounded-2xl border-2 border-brand/40 animate-ping" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">Analyzing your syllabus</h1>
              <p className="text-sm text-muted mt-1">This usually takes 10–15 seconds. Please stay on this page.</p>
            </div>
            <div className="w-full max-w-md">
              <ProgressBar value={progress} />
              <p className="mt-2 text-xs font-mono text-muted">{progress}%</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProcessingSteps steps={PROCESSING_STEPS} activeIndex={step} />
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-widest text-subtle">Preview</p>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-3 grid grid-cols-3 gap-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
              <Skeleton className="h-4 w-1/2 mt-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
