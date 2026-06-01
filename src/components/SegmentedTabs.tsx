import type { ReactNode } from "react";

export interface SegOption<T extends string> {
  value: T;
  label: ReactNode;
}

export function SegmentedTabs<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly [SegOption<T>, SegOption<T>];
  className?: string;
}) {
  const activeIndex = options.findIndex((option) => option.value === value);

  return (
    <div className={`seg grid grid-cols-2 gap-1 rounded-2xl p-1 ${className}`}>
      <span className="seg-indicator" data-pos={activeIndex} aria-hidden />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          data-active={value === option.value}
          onClick={() => onChange(option.value)}
          className="seg-item cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-transform active:scale-95"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
