const PARTNERS = [
  'METROPOLITAN',
  'IRON & FORGE',
  'APEX CLUB',
  'PULSE LABS',
  'ELEVATE CO.',
  'TITAN BOXING',
];

export default function LogoCloud() {
  return (
    <section className="border-b border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
          Trusted by 480+ leading athletic clubs, CrossFit boxes & boutique studios
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              className="text-base sm:text-lg font-black tracking-widest text-gray-400/80 hover:text-gray-700 transition-colors uppercase font-mono select-none"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
