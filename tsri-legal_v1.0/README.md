# ระบบฐานข้อมูลและสืบค้นกฎหมายตามอำนาจหน้าที่ สกสว. (TSRI Legal & Competency Intelligence Portal)

**รหัสโครงการวิจัย:** `PRJ-TSRI-2569-001` (ตามเอกสารแนบท้ายสัญญา `TOR-PROJ-001-2569`)
**คลังข้อมูลต้นทาง:** [คลังข้อมูลกฎหมาย สกสว. ทั้ง 12 หมวด (103 ไฟล์ใช้งานจริง / 104 รหัสทะเบียน · รุ่น V6 ความก้าวหน้า 75–80%)](https://drive.google.com/drive/folders/1lGYjlvzdd-9CyjlBt2rdOdWdX-eLCLq9)

## 1. สถาปัตยกรรมระบบ (Tech Stack สำหรับ Antigravity IDE & Cloudflare)
- **Frontend:** React 18 + Vite 5 + TypeScript + Tailwind CSS + Recharts + Lucide Icons
- **Backend / Edge API:** Cloudflare Pages Functions + Hono (`functions/api/[[route]].ts`)
- **Database:** Cloudflare D1 Serverless SQLite (`db/schema.sql` และ `db/seed.sql` บรรจุข้อมูลครบทั้ง 101 รหัสเอกสาร, 9 คลัสเตอร์, Cross-List 15 ข้อ, คำถามสัมภาษณ์ 32 ข้อ, สื่อวิดีโอ 15 คลิป และคลังข้อสอบ 30:70 จำนวน 15 ข้อมาตรฐาน)
- **AI Engine:** Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct` และ Embeddings `@cf/baai/bge-m3`) พร้อมระบบปรับสัดส่วนคำตอบตามระดับตำแหน่ง (Role-Based Knowledge Weighting: คณะกรรมการ `80:20`, ผู้บริหารระดับสูง `60:40`, ผู้บริหารระดับกลาง `45:55`, ผู้บริหารระดับต้นและผู้ปฏิบัติงาน `30:70`)

## 2. โครงสร้างโฟลเดอร์สำหรับพัฒนาต่อบน Antigravity IDE
```text
tsri-legal-km-cloudflare-antigravity/
├── .antigravity/
│   └── workspace.json          # ค่าตั้งต้นสำหรับเปิดโปรเจกต์ใน Antigravity IDE
├── .vscode/
│   └── tasks.json              # คำสั่งลัด 1-Click สำหรับ Run Dev / Seed D1 / Deploy
├── db/
│   ├── schema.sql              # โครงสร้างตารางฐานข้อมูล Cloudflare D1
│   └── seed.sql                # ข้อมูลตั้งต้นรุ่น V6 ครบ 104 รหัสเอกสาร (12 หมวด) + 24 สายโซ่กฎหมาย 3 ระดับ + Cross-List 15 + ข้อสอบ 30:70
├── functions/
│   └── api/
│       └── [[route]].ts        # Cloudflare Pages Function / Worker API + Workers AI RAG
├── src/
│   ├── data/
│   │   └── tsriDatabase.ts     # ข้อมูลฐานแบบ Typed สำหรับโหมด Offline-First และ Local Preview
│   ├── App.tsx                 # คอมโพเนนต์หลักครบทั้ง 7 โมดูล
│   ├── main.tsx                # Entry point ของ React 18
│   └── index.css               # Tailwind CSS directives
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.toml               # ไฟล์ตั้งค่า Cloudflare Pages, D1, Workers AI และ Vectorize
```

## 3. ขั้นตอนการรันและ Deploy ขึ้น Cloudflare Pages / Workers
```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. สร้างและนำเข้าข้อมูลลงฐานข้อมูล Cloudflare D1 (Local)
npx wrangler d1 create tsri_legal_km_db
npm run db:init:local

# 3. รันเซิร์ฟเวอร์พัฒนาบน Antigravity IDE
npm run dev

# 4. Deploy ขึ้น Cloudflare Pages / Workers (Production)
npm run db:init:remote
npm run deploy
```
