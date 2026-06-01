import { DAILY_CAP, formatBaht, MONTHLY_CAP, RATE } from "@/lib/calc";
import { Header } from "@/components/common/Header";

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-center justify-between border-t border-line pt-2">
      <span>{k}</span>
      <span className="figure font-semibold text-ink">{v}</span>
    </li>
  );
}

export function InfoView() {
  return (
    <div className="view-enter">
      <Header title="เกี่ยวกับโครงการ" subtitle="ไทยช่วยไทย พลัส 60/40" />

      <div className="card rise space-y-4 rounded-3xl p-5 text-[13.5px] leading-relaxed text-ink-soft [animation-delay:80ms]">
        <p>
          โครงการร่วมจ่าย <b className="text-ink">รัฐช่วย {RATE * 100}%</b> ประชาชน
          จ่ายเอง {100 - RATE * 100}% ของยอดซื้อ
        </p>
        <ul className="space-y-2">
          <InfoRow k="เพดานสิทธิ์รัฐช่วย/วัน" v={`฿${formatBaht(DAILY_CAP)}`} />
          <InfoRow k="เพดานสิทธิ์รัฐช่วย/เดือน" v={`฿${formatBaht(MONTHLY_CAP)}`} />
          <InfoRow k="ระยะโครงการ" v="1 มิ.ย. – 30 ก.ย. 2569" />
        </ul>
        <p className="text-[12.5px] text-ink-faint">
          ถ้ารัฐช่วยตามสูตร (60%) เกินเพดานสิทธิ์ที่เหลือ จะถูกตัดที่เพดาน
          ส่วนเกินคุณจ่ายเองเต็มจำนวน
        </p>
      </div>

      <div className="rise mt-4 rounded-3xl border border-warn-line bg-warn-bg p-5 text-[12.5px] leading-relaxed text-warn-ink [animation-delay:160ms]">
        ⚠️ <b>เครื่องมือไม่เป็นทางการ</b> ใช้ประมาณการเท่านั้น ตัวเลขจริงให้ยึดตาม
        แอปเป๋าตัง/ประกาศราชการ
        <br />
        ข้อมูลอ้างอิงจาก{" "}
        <a
          href="https://www.thairath.co.th/news/politic/2936480"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          ข่าวไทยรัฐ
        </a>
      </div>
    </div>
  );
}
