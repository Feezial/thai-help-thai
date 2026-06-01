import { useEffect, useRef, useState } from "react";

/** นับตัวเลขวิ่งจากค่าเดิมไปค่าใหม่ (easeOutCubic) — เคารพ prefers-reduced-motion */
export function useCountUp(target: number, duration = 450): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = valueRef.current;
    if (reduce || from === target) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const progress = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
