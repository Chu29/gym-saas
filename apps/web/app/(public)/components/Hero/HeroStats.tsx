const STATS = [
  { value: '480+', label: 'Gyms & Studios Deployed' },
  { value: '$68M+', label: 'Annual Dues Processed' },
  { value: '99.4%', label: 'Member Retention Rate' },
  { value: '2.8M+', label: 'Turnstile Check-ins' },
];

export function HeroStats() {
  return (
    <div className="mx-auto mt-14 max-w-5xl border-y border-gray-100 py-8 sm:py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {STATS.map((stat, idx) => (
          <div key={stat.label} className={idx > 0 ? 'pt-4 md:pt-0' : ''}>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
              {stat.value}
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
