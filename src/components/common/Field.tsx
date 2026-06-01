export function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <div className="relative">
        <span
          aria-hidden
          className="figure pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint"
        >
          ฿
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="field figure w-full rounded-2xl py-4 pr-4 pl-9 text-3xl font-bold"
        />
      </div>
    </div>
  );
}
