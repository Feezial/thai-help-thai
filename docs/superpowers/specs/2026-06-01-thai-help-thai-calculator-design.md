# เครื่องคำนวณ "ไทยช่วยไทย พลัส 60/40"

วันที่: 2026-06-01

## เป้าหมาย

เว็บสาธารณะ (ภาษาไทย, mobile-first) ช่วยให้ประชาชนคำนวณว่าเมื่อใช้สิทธิ์โครงการ
"ไทยช่วยไทย พลัส 60/40" แล้ว **ต้องจ่ายเองเท่าไร** และ **เหลือสิทธิ์รัฐช่วยวันนี้/เดือนนี้เท่าไร**

แหล่งอ้างอิงข้อมูลโครงการ: ข่าวไทยรัฐ https://www.thairath.co.th/news/politic/2936480

> ⚠️ เครื่องมือไม่เป็นทางการ — ตัวเลขอ้างอิงจากข่าว ไม่ใช่ระบบราชการจริง

## กติกาโครงการ (ตามที่ยืนยันกับผู้ใช้)

- รัฐช่วย **60%** ประชาชนจ่ายเอง **40%** ของยอดซื้อ
- เพดาน **"เงินที่รัฐช่วย (60%)"**: สูงสุด **200 บาท/วัน** และ **1,000 บาท/เดือน**
- ถ้ารัฐช่วยตามสูตร (60% ของยอด) เกินเพดานสิทธิ์ที่เหลือ → รัฐช่วยแค่เท่าเพดาน
  ส่วนเกินผู้ใช้จ่ายเองเต็มจำนวน (ทำให้บางครั้งจ่ายเกิน 40%)
- ระยะโครงการ 1 มิ.ย.–30 ก.ย. 2569 (แสดงเป็นข้อมูลประกอบ ไม่ผูกกับ logic)

## ขอบเขต (scope)

- ✅ โหมด 1 — คำนวณส่วนลด (forward)
- ✅ โหมด 2 — คำนวณย้อนกลับ (reverse): สิทธิ์เหลือ → ซื้อได้สูงสุดที่ยังได้ 60% เต็ม
- ✅ คำอธิบายโครงการสั้น ๆ + คำเตือน "ไม่เป็นทางการ"
- ✅ รองรับ dark mode (ต่อยอดจาก boilerplate)
- ❌ ไม่เก็บประวัติ / ไม่มี backend / ไม่มี localStorage (ผู้ใช้กรอกยอดที่ใช้ไปเอง)
- ❌ ไม่มี FAQ ยาว, ไม่มี progress bar, ไม่มีปุ่มแชร์ (YAGNI)

## สถาปัตยกรรม (แนวทาง A — หน้าเดียว + แท็บ)

```
src/
  app/
    layout.tsx      # เพิ่มฟอนต์ไทย (Noto Sans Thai) + metadata ภาษาไทย + lang="th"
    page.tsx        # Server Component: หัวเรื่อง/คำอธิบาย + <Calculator/> + เชิงอรรถ
    globals.css     # แก้ body font ให้ใช้ตัวแปรฟอนต์ (เลิก hardcode Arial)
    calculator.tsx  # 'use client' — UI: แท็บ 2 โหมด, ช่องกรอก, การ์ดผลลัพธ์, แถบเตือน
  lib/
    calc.ts         # pure functions ทั้งหมด (ไม่มี React) — แกนที่ TDD ครอบ
    calc.test.ts    # unit tests (Vitest)
```

แยก logic (lib/calc.ts) ออกจาก UI (calculator.tsx) เด็ดขาด → เทสต์ logic ได้โดยไม่ต้องเรนเดอร์ UI

## โมเดลการคำนวณ (lib/calc.ts)

ค่าคงที่:
```
RATE = 0.60
DAILY_CAP = 200
MONTHLY_CAP = 1000
```

ทุกผลลัพธ์ที่เป็นเงินปัดทศนิยม 2 ตำแหน่ง (สตางค์) ด้วย round2(x) = Math.round(x*100)/100

### โหมด 1 — calcDiscount(input)

input: `{ price, usedToday, usedMonth }` (บาท)

```
remainingDaily   = max(0, DAILY_CAP   − usedToday)
remainingMonthly = max(0, MONTHLY_CAP − usedMonth)
availableSubsidy = min(remainingDaily, remainingMonthly)

idealSubsidy = RATE × price          // รัฐช่วยเต็มสูตร
govPays      = min(idealSubsidy, availableSubsidy)
youPay       = price − govPays
capped       = idealSubsidy > availableSubsidy + ε   // โดนเพดานตัด

remainingDailyAfter   = remainingDaily   − govPays
remainingMonthlyAfter = remainingMonthly − govPays
effectiveDiscountPct  = price > 0 ? govPays / price : 0
```

output: `{ price, govPays, youPay, capped, availableSubsidy, remainingDaily,
  remainingMonthly, remainingDailyAfter, remainingMonthlyAfter, effectiveDiscountPct }`

### โหมด 2 — calcReverse(remainingSubsidy)

```
maxPurchaseFullSubsidy = remainingSubsidy ÷ RATE
youPayAtMax            = maxPurchaseFullSubsidy − remainingSubsidy
```

output: `{ remainingSubsidy, maxPurchaseFullSubsidy, youPayAtMax }`

## Validation / กรณีขอบ

- parse ค่าจาก input เป็น number; ค่าว่าง/ไม่ใช่ตัวเลข → 0
- clamp: price ≥ 0; usedToday ∈ [0, DAILY_CAP]; usedMonth ∈ [0, MONTHLY_CAP];
  remainingSubsidy ∈ [0, DAILY_CAP]
- usedToday = 200 หรือ usedMonth = 1000 → availableSubsidy = 0 → govPays = 0 (เตือน "เต็มสิทธิ์แล้ว")
- price = 0 → ทุกค่าเป็น 0, ไม่ capped
- ทศนิยม: เปรียบเทียบ capped ด้วย epsilon เล็ก ๆ กันปัญหา float

## ตัวอย่างทดสอบ (เป็นเคสใน calc.test.ts)

| ยอดซื้อ | ใช้วันนี้ | ใช้เดือนนี้ | รัฐช่วย | คุณจ่าย | capped |
|--------:|---------:|-----------:|-------:|-------:|:------:|
| 300     | 0        | 0          | 180    | 120    | ไม่     |
| 500     | 0        | 0          | 200    | 300    | ใช่     |
| 300     | 0        | 950        | 50     | 250    | ใช่     |
| 100     | 200      | 0          | 0      | 100    | ใช่     |
| 0       | 0        | 0          | 0      | 0      | ไม่     |

reverse: remainingSubsidy 200 → maxPurchase 333.33, youPayAtMax 133.33

## UI (mobile-first)

- การ์ดกลางจอ; แท็บสองโหมดด้านบน (คำนวณส่วนลด / ดูว่าซื้อได้เท่าไร)
- ช่องกรอกตัวเลขใหญ่ (inputMode="decimal") กดง่ายบนมือถือ
- ผลลัพธ์เป็นการ์ด: รัฐช่วย / คุณจ่าย / สิทธิ์คงเหลือ (วัน·เดือน)
- แถบเตือนสีเหลืองเมื่อ capped หรือใกล้เต็มสิทธิ์
- คำนวณสด ๆ ขณะพิมพ์ (ไม่มีปุ่ม submit)
- ส่วนหัวอธิบาย 60/40 1–2 บรรทัด + เชิงอรรถ "ไม่เป็นทางการ อ้างอิงข่าว"
- dark mode รองรับผ่าน prefers-color-scheme

## เทคโนโลยี

- Next.js 16.2.6 (App Router, Turbopack default), React 19.2
- Tailwind v4 (@import "tailwindcss" + @theme inline)
- next/font/google: Noto Sans Thai (subsets thai+latin)
- Vitest สำหรับ unit test แกนคำนวณ (TDD)

## เกณฑ์ว่าเสร็จ (definition of done)

- unit test ของ lib/calc.ts ครอบทุกเคสในตาราง + reverse และผ่านทั้งหมด
- หน้าเว็บคำนวณถูกต้องทั้งสองโหมด ใช้งานบนมือถือได้
- `next build` ผ่าน (Turbopack) ไม่มี error
