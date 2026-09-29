import { Badge } from '@repo/ui/components/ui/badge';

export interface StepItem {
  stepNumber: string;
  title: string;
  description: string;
}

export function StepCard({ step }: { step: StepItem }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-6 shadow-xs hover:border-gray-300 transition-all">
      <div>
        <Badge
          variant="outline"
          className="border-gray-200 bg-gray-50 text-[10px] font-bold tracking-wider text-gray-500 uppercase px-2 py-0.5"
        >
          {step.stepNumber}
        </Badge>
        <h3 className="mt-4 text-base sm:text-lg font-bold text-gray-950">{step.title}</h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}
