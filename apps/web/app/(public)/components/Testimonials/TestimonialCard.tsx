import { Badge } from '@repo/ui/components/ui/badge';

export interface TestimonialItem {
  metricBadge: string;
  facilityBadge: string;
  quote: string;
  initials: string;
  name: string;
  role: string;
}

export function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-gray-300 transition-all">
      <div>
        {/* Metric Badges */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-[11px] font-bold text-[#16A34A] tracking-wider uppercase"
          >
            {testimonial.metricBadge}
          </Badge>
          <span className="text-xs font-medium text-gray-500">{testimonial.facilityBadge}</span>
        </div>

        {/* Quote */}
        <p className="mt-5 text-sm sm:text-base text-gray-700 leading-relaxed italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Author Profile */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 border border-gray-200">
          {testimonial.initials}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-950">{testimonial.name}</h4>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
