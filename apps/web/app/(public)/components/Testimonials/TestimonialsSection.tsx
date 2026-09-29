import { TestimonialCard, type TestimonialItem } from './TestimonialCard';

const TESTIMONIALS: TestimonialItem[] = [
  {
    metricBadge: '+38% REVENUE GROWTH',
    facilityBadge: '2,100 Members',
    quote:
      'FITNEXA replaced Mindbody and saved us 14 administrative hours every week while eliminating turnstile queue bottlenecks during peak morning rushes.',
    initials: 'MV',
    name: 'Marcus Vance',
    role: 'Founder & MD, Steel System Athletics',
  },
  {
    metricBadge: '+42% PT RETENTION',
    facilityBadge: 'Apex Box',
    quote:
      'The trainer suite alone pays for the platform. Our athletes follow their periodized plans with 84% compliance, and coach retention has reached an all-time high.',
    initials: 'SJ',
    name: 'Sarah Jenkins',
    role: 'Head Coach & Partner, Apex Box',
  },
  {
    metricBadge: '99.4% COLLECTION RATE',
    facilityBadge: 'Titan Box',
    quote:
      'The Mobile Money integration was game-changing for our branches in Accra and Lagos. Collection rates jumped from 71% to 99.4% in 60 days flat.',
    initials: 'DO',
    name: 'David Osei',
    role: 'Managing Director, Titan Athletic Club',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="border-b border-gray-100 bg-gray-50/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            Proven by Gym Owners Across the Globe
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Real results from real operators managing high-capacity athletic facilities.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
