/** ช่องกรอกจำนวนเงิน (มีสัญลักษณ์ ฿ นำหน้า, ใส่ suffix/ขนาดได้) */
export function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  suffix,
  size = "lg",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: string;
  size?: "lg" | "sm";
}) {
  const sizing = size === "lg" ? "py-4 text-3xl" : "py-3 text-lg";

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
          className={`field figure w-full rounded-2xl pl-9 font-bold ${sizing} ${
            suffix ? "pr-14" : "pr-4"
          }`}
        />
        {suffix && (
          <span className="figure pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-ink-faint">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
