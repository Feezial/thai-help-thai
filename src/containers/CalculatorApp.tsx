"use client";

import { useState } from "react";
import { usedThisMonth, usedToday } from "@/lib/history";
import { useHistory } from "@/hooks/useHistory";
import type { Tab } from "@/types/ui";
import { BottomNav } from "@/components/common/BottomNav";
import { CalcView } from "./CalcView";
import { HistoryView } from "./HistoryView";
import { InfoView } from "./InfoView";

export default function CalculatorApp() {
  const [tab, setTab] = useState<Tab>("calc");
  const history = useHistory();

  const todayUsed = usedToday(history.entries, history.now);
  const monthUsed = usedThisMonth(history.entries, history.now);

  return (
    <div className="app-frame">
      <main className="flex-1 px-4 pt-7 pb-28">
        {tab === "calc" && (
          <CalcView
            usedToday={todayUsed}
            usedMonth={monthUsed}
            onSave={history.addEntry}
            goHistory={() => setTab("history")}
          />
        )}
        {tab === "history" && (
          <HistoryView
            entries={history.entries}
            now={history.now}
            ready={history.ready}
            usedToday={todayUsed}
            onRemove={history.removeEntry}
            onClear={history.clearAll}
            goCalc={() => setTab("calc")}
          />
        )}
        {tab === "info" && <InfoView />}
      </main>

      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
