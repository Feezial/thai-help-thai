import { formatBaht } from "@/lib/calc";
import { useCountUp } from "@/hooks/useCountUp";

export function AnimatedBaht({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const shown = useCountUp(value);
  return <span className={className}>฿{formatBaht(shown)}</span>;
}
