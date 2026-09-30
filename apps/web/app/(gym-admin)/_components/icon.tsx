// Renders a Material Symbols glyph; the font is loaded in the gym-admin layout.
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}
