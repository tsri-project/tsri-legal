# Antigravity IDE Agent & Workspace Rules — TSRI Legal & Competency Intelligence Portal (Version 6.0)

## 1. Project Context & Version 6.0 Baseline
- **Project Code:** `PRJ-TSRI-2569-001` (`TOR-PROJ-001-2569`)
- **Repository Scale:** **12 Categories** (`หมวดที่ 1` to `หมวดที่ 12`) totaling **104 Registered Codes** (`TSRI-DOC-0001` to `TSRI-DOC-0104`) and **103 Active Unique Files** (with duplicate `TSRI-F06-00-004` / `TSRI-DOC-0082` retired via SHA-256 verification).
- **3-Level Legal Classification (TOR 4.1.1):**
  1. **Level 1 (`4.1.1.1` กฎหมายแม่บทและกฎหมายจัดตั้ง):** 4 files (`TSRI-DOC-0001`, `0002`, `0025`, `0026`).
  2. **Level 2 (`4.1.1.2` กฎหมายลำดับรอง คู่มือปฏิบัติงาน และ SOP):** 94 active files / 95 registered codes.
  3. **Level 3 (`4.1.1.3` กฎหมายที่เกี่ยวข้อง):** 5 files (`TSRI-DOC-0037` พ.ร.บ. TRIUP 2564, `TSRI-DOC-0100` รายงานประเมินผลสัมฤทธิ์ ม.77, and Category 12's 3 laws: `TSRI-DOC-0102` พ.ร.บ.วิธีการงบประมาณ พ.ศ. 2561, `TSRI-DOC-0103` พ.ร.บ.วินัยการเงินการคลังของรัฐ พ.ศ. 2561, `TSRI-DOC-0104` พ.ร.บ.การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560).
- **Operational Progress Guardrail (75–80%):** All operational dashboards and status indicators must display **75–80%** (`คัดกรองด่าน G1 80% · รอที่ปรึกษาทางกฎหมายตรวจรับรองด่าน G2 75%`) until formal legal advisor sign-off at Stage Gate G2 is completed.

## 2. Development & Deployment Commands in Antigravity IDE
- **Install dependencies:** `npm install`
- **Initialize local Cloudflare D1 SQLite database:** `npm run db:init:local`
- **Start local Vite + Hono dev server:** `npm run dev`
- **Preview full Cloudflare Pages + D1 + Workers AI bundle locally:** `npm run preview`
- **Deploy to Cloudflare Pages Production:** `npm run db:init:remote && npm run deploy`
