import React from 'react';
import { Cloud, Copy, Cpu, Database, FolderGit2 } from 'lucide-react';
import { SfBadge, SfButton, SfCard } from '../SoftFocusUI';

interface DevTabProps {
  onCopyText: (text: string, label?: string) => void;
}

const CLI_SNIPPET = `# 1. แตกไฟล์ซิปและเปิดโฟลเดอร์โปรเจกต์ใน Antigravity IDE
unzip tsri-legal-km-cloudflare-antigravity.zip -d tsri-legal-km
cd tsri-legal-km
npm install

# 2. สร้างฐานข้อมูล Cloudflare D1 และนำเข้าข้อมูลทั้ง 101 รหัสเอกสาร + Cross-List + ข้อสอบ 30:70
npx wrangler d1 create tsri_legal_km_db
npx wrangler d1 execute tsri_legal_km_db --local --file=./db/schema.sql
npx wrangler d1 execute tsri_legal_km_db --local --file=./db/seed.sql

# 3. รันทดสอบระบบแบบ Local (Vite + Cloudflare Pages Dev)
npm run dev

# 4. Deploy ขึ้น Cloudflare Pages / Workers บน Production
npx wrangler d1 execute tsri_legal_km_db --remote --file=./db/schema.sql
npx wrangler d1 execute tsri_legal_km_db --remote --file=./db/seed.sql
npm run deploy`;

export function DevTab({ onCopyText }: DevTabProps) {
  return (
    <div className="space-y-5 sf-view-enter">
      <SfCard className="space-y-4">
        <div className="space-y-1">
          <SfBadge tone="primary">Cloudflare Edge + Antigravity IDE</SfBadge>
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 pt-1">
            <Cloud className="w-5 h-5" />
            <span>สถาปัตยกรรม Full-Stack สำหรับพัฒนาและ Deploy ขึ้น Cloudflare Pages / Workers</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--muted)]">
            รองรับฐานข้อมูล Serverless SQL (Cloudflare D1) และ Workers AI RAG พร้อมชุด UI Soft Focus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <SfCard tone="sky" className="!p-5 space-y-2">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4" />
              <span>1. Frontend Stack</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside opacity-90 leading-relaxed">
              <li>React 18.3 + Vite 5 + TypeScript</li>
              <li>Soft Focus UI Kit (Sunny &amp; Lavender) + Mobile Slide UX</li>
              <li>Role-Based State: 5 Role Lenses (80:20 ถึง 30:70)</li>
              <li>Offline-First Hybrid Dataset ในตัว</li>
            </ul>
          </SfCard>

          <SfCard tone="mint" className="!p-5 space-y-2">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              <span>2. Cloudflare Functions &amp; D1</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside opacity-90 leading-relaxed">
              <li>Edge API: Hono (<code>functions/api/[[route]].ts</code>)</li>
              <li>Database: Cloudflare D1 (<code>db/schema.sql</code> &amp; <code>db/seed.sql</code>)</li>
              <li>Seeded Records: 101 รหัส, 9 Clusters, 15 Cross-List, 32 คำถาม, 15 คลิป, 15 ข้อสอบ</li>
            </ul>
          </SfCard>

          <SfCard tone="lilac" className="!p-5 space-y-2">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>3. Workers AI &amp; RAG</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside opacity-90 leading-relaxed">
              <li>Embeddings: <code>@cf/baai/bge-m3</code> (รองรับไทย &amp; มาตรา)</li>
              <li>LLM: <code>@cf/meta/llama-3.1-8b-instruct</code></li>
              <li>System Prompt กำกับสัดส่วน 80:20 ถึง 30:70</li>
              <li>Zero Cold-Start บน Edge Network</li>
            </ul>
          </SfCard>
        </div>
      </SfCard>

      <SfCard className="!bg-[#252622] text-[#f3f0eb] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
          <span className="text-xs md:text-sm font-semibold text-[#ffd05a]">
            คำสั่ง CLI สำหรับ Antigravity IDE และ Deploy ขึ้น Cloudflare
          </span>
          <SfButton
            variant="primary"
            onClick={() => onCopyText(CLI_SNIPPET, 'คัดลอกคำสั่ง CLI ทั้งหมดแล้ว')}
            className="!min-h-[38px] !px-3.5 text-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>คัดลอกคำสั่ง</span>
          </SfButton>
        </div>
        <pre className="overflow-x-auto text-xs font-mono leading-relaxed text-[#deebda]">
          {CLI_SNIPPET}
        </pre>
      </SfCard>
    </div>
  );
}

