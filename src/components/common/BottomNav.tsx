import type { ReactNode } from "react";
import type { Tab } from "@/types/ui";
import { IconCalc, IconHistory, IconInfo } from "../icons";

const ITEMS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "calc", label: "คำนวณ", icon: <IconCalc /> },
  { id: "history", label: "ประวัติ", icon: <IconHistory /> },
  { id: "info", label: "ข้อมูล", icon: <IconInfo /> },
];

export function BottomNav({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav className="nav-bar sticky bottom-4 z-20 mx-4 grid grid-cols-3 gap-1 rounded-2xl p-1.5">
      {ITEMS.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            data-active={active}
            aria-current={active}
            onClick={() => onChange(item.id)}
            className={`nav-item flex flex-col items-center gap-1 rounded-xl py-2 transition-colors active:scale-95 ${
              active ? "bg-blue-050" : ""
            }`}
          >
            <span className={active ? "icon-pop" : ""}>{item.icon}</span>
            <span className="text-[11px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
