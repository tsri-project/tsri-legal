import React from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  ExternalLink,
  Layers,
  Scale,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MASTER_BUNDLE as DB } from '../../data/tsriDatabase';
import { PortalTabId, RoleTier } from '../../types/portal';
import { SfBadge, SfButton, SfCard, SlideDeck } from '../SoftFocusUI';

interface DashboardTabProps {
  selectedRole: string;
  onSelectRole: (roleId: string) => void;
  currentRoleObj: RoleTier;
  onNavigateTab: (tab: PortalTabId) => void;
  onSelectCategory: (catIdx: string) => void;
  onInspectDocByCode: (code: string) => void;
}

export function DashboardTab({
  selectedRole,
  onSelectRole,
  currentRoleObj,
  onNavigateTab,
  onSelectCategory,
  onInspectDocByCode,
}: DashboardTabProps) {
  const kpiCards = [
    {
      label: 'คลังกฎหมาย 12 หมวด (V6)',
      value: '103 ไฟล์',
      note: '104 รหัสทะเบียน · 24 สายโซ่ 3 ระดับ',
      tone: 'primary' as const,
      iconBg: 'var(--primary)',
      icon: <BookOpen className="w-4 h-4 text-[var(--on-primary)]" />,
      tab: 'repository' as PortalTabId,
    },
    {
      label: 'กรอบภารกิจ 9 คลัสเตอร์',
      value: '112 ภารกิจ',
      note: '159 คู่เชื่อม · Cross-List 15 ข้อ',
      tone: 'sky' as const,
      iconBg: 'var(--sky)',
      icon: <Layers className="w-4 h-4 text-[var(--ink)]" />,
      tab: 'clusters' as PortalTabId,
    },
    {
      label: 'ภาคสนามระยะที่ 3',
      value: '80 คน',
      note: '32 คำถาม · 6 FGD · 6 สายตรวจแฟ้ม',
      tone: 'mint' as const,
      iconBg: 'var(--mint)',
      icon: <Users className="w-4 h-4 text-[var(--positive)]" />,
      tab: 'phase3' as PortalTabId,
    },
    {
      label: 'สื่อและข้อสอบ 30:70',
      value: '15 คลิป',
      note: '12 ชุดข้อสอบ · คัมภีร์ 2 · อินโฟ 8',
      tone: 'lilac' as const,
      iconBg: 'var(--lilac)',
      icon: <Award className="w-4 h-4 text-[var(--ink)]" />,
      tab: 'phase4' as PortalTabId,
    },
  ];

  const guardrails = [
    {
      tone: 'rose' as const,
      badge: 'การเงินและพัสดุ · พด.70/2564',
      title: '1. แยก 2 บัญชี & วงเงิน 500,000 บาท',
      body: 'แยกเงินสำนักงาน (ม.45) ออกจากเงินกองทุน ววน. (ม.55) อย่างเด็ดขาด วงเงินไม่เกิน 500,000 บาท: งบสำนักงานอนุมัติโดย ผอ.สำนัก F5 ส่วนงบกองทุนอนุมัติโดย ผอ.สำนัก F2 (พัสดุ ≤ 10,000 บาท ตาม พด.71/2564)',
    },
    {
      tone: 'mint' as const,
      badge: 'งบประมาณ · คำรับรอง ม.18',
      title: '2. วงจรคำของบ & คืนเงิน PMU ใน 45 วัน',
      body: 'เปิดรับคำขอ FF/SF 45 วัน → กลั่นกรอง 20 วัน → แก้ไข 20 วัน → ปรับ Pre-ceiling 15+10 วัน ออกคำรับรอง ม.18 (ผูกพันข้ามปี 50:50) และ PMU ต้องคืนเงินเหลือจ่ายพร้อมดอกเบี้ยภายใน 45 วัน',
    },
    {
      tone: 'lilac' as const,
      badge: 'ปิดบัญชี & ความลับ ม.36',
      title: '3. ปิดงบ 90/180 วัน · โทษอาญา ม.36',
      body: 'ส่งงบสำนักงานต่อผู้สอบบัญชีใน 90 วัน (ม.39) vs ส่งงบกองทุนต่อ สตง. ใน 180 วัน (ม.61) · เปิดเผยความลับฐานข้อมูล NRIIS มีโทษจำคุกไม่เกิน 5 ปี / ปรับ 100,000 บาท · ทวงหนี้ สกว. เตือน 30 วัน / เลิก 15 วัน',
    },
  ];

  return (
    <div className="space-y-6 sf-view-enter">
      {/* Top 2-Column Soft Focus Layout (1.5fr Hero + 1fr Summary Stack on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Hero Role Lens Card (Primary Surface, Soft Focus Style) */}
        <SfCard tone="primary" className="lg:col-span-7 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SfBadge tone="surface">
                <Scale className="w-3.5 h-3.5" />
                <span>มุมมองใช้งานปัจจุบัน · {currentRoleObj.ratio}</span>
              </SfBadge>
              <a
                href={DB.links.MASTER_DB_V03}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[var(--on-primary)] underline-offset-4 hover:underline inline-flex items-center gap-1"
              >
                <span>ฐานข้อมูล v0.3</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl md:text-[28px] font-semibold leading-tight tracking-tight">
                {currentRoleObj.name}
              </h2>
              <p className="text-sm text-[var(--on-primary)] opacity-90 leading-relaxed">
                {currentRoleObj.decision_focus}
              </p>
            </div>

            {/* Minimalist Soft Focus Horizon SVG */}
            <svg
              className="w-full h-24 md:h-28 block opacity-90"
              viewBox="0 0 600 120"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="460" cy="48" r="24" fill="#ffffff" fillOpacity="0.65" />
              <path
                d="M0 98 C120 62, 220 110, 340 72 C440 40, 520 64, 600 48 L600 120 L0 120 Z"
                fill="#576e43"
                fillOpacity="0.35"
              />
              <path
                d="M0 106 C150 84, 280 54, 420 82 C500 98, 560 88, 600 76 L600 120 L0 120 Z"
                fill="#3e5530"
                fillOpacity="0.55"
              />
            </svg>

            {/* Quick Role Docs Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold opacity-85 mr-1">เอกสารหลัก:</span>
              {currentRoleObj.must_know_docs.slice(0, 4).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onInspectDocByCode(code)}
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white text-[var(--ink)] text-xs font-mono font-semibold transition"
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Single Primary CTA + Secondary Action */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onNavigateTab('ai')}
                className="sf-button sf-button--secondary w-full sm:flex-1 justify-between"
                style={{ borderColor: 'transparent' }}
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>ถาม AI วินิจฉัยในมุมมองนี้</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('repository')}
                className="sf-button sf-button--ghost justify-center"
                style={{ background: 'rgba(255,255,255,0.45)', color: 'var(--on-primary)' }}
              >
                <BookOpen className="w-4 h-4" />
                <span>เปิดคลัง 103 ไฟล์</span>
              </button>
            </div>
          </div>
        </SfCard>

        {/* Right Column: Summary Metric Grid + Quick Action Note */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {kpiCards.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="sf-card text-left p-4 hover:outline hover:outline-2 hover:outline-[var(--ink)] transition cursor-pointer flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="w-9 h-9 rounded-full grid place-items-center shrink-0"
                    style={{ background: item.iconBg }}
                  >
                    {item.icon}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--ink)]">
                    {item.value}
                  </div>
                  <div className="text-xs font-semibold text-[var(--ink)] mt-0.5">{item.label}</div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5 line-clamp-2">{item.note}</div>
                </div>
              </button>
            ))}
          </div>

          <SfCard className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs text-[var(--muted)]">คลังเอกสารต้นฉบับ Google Drive (V6)</div>
              <div className="text-sm font-semibold">ครบทั้ง 12 หมวด (103 ไฟล์จริง · 75–80%)</div>
            </div>
            <a
              href={DB.links.ROOT_DB}
              target="_blank"
              rel="noopener noreferrer"
              className="sf-button sf-button--secondary shrink-0"
            >
              <span>เปิด Drive</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </SfCard>
        </div>
      </div>

      {/* Slide Deck 1: Role-Based 5-Tier Authority Matrix */}
      <SlideDeck
        title={
          <span className="inline-flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>สไลด์เลือกระดับอำนาจหน้าที่ (Role-Based Lens 5 ระดับ)</span>
          </span>
        }
        subtitle="เลื่อนซ้าย–ขวาเพื่อดูสัดส่วนกฎหมายแม่บท : กฎรอง และแตะการ์ดเพื่อเปลี่ยนมุมมองทั้งระบบ"
        itemCount={DB.roleTiers.slice(1).length}
        itemClassName="sf-slide-item sf-slide-item--compact"
      >
        {DB.roleTiers.slice(1).map((tier) => {
          const isSelected = selectedRole === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectRole(tier.id)}
              className={`sf-card w-full h-full text-left flex flex-col justify-between gap-4 transition cursor-pointer ${
                isSelected ? 'sf-card--primary' : ''
              }`}
              style={{
                border: isSelected ? '2px solid var(--ink)' : '1px solid var(--border)',
              }}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <SfBadge tone={isSelected ? 'surface' : 'lilac'}>{tier.ratio}</SfBadge>
                  <span className="text-xs font-medium opacity-80">
                    แม่บท {tier.statutory_pct}% : รอง {tier.operational_pct}%
                  </span>
                </div>
                <div className="font-semibold text-base leading-snug">{tier.name}</div>
                <p className="text-xs opacity-85 line-clamp-3 leading-relaxed">
                  {tier.authority_scope}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-black/10 w-full">
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-black/10">
                  <div
                    className="h-full"
                    style={{ width: `${tier.statutory_pct}%`, background: 'var(--ink)' }}
                  />
                  <div
                    className="h-full"
                    style={{ width: `${tier.operational_pct}%`, background: 'var(--positive)' }}
                  />
                </div>
                <div className="flex justify-between text-[11px] opacity-80">
                  <span>แม่บท {tier.statutory_pct}%</span>
                  <span>ปฏิบัติการ {tier.operational_pct}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </SlideDeck>

      {/* Slide Deck 2: Key Legal Guardrails */}
      <SlideDeck
        title="จุดตัดอำนาจหน้าที่และเพดานตัวเลขบังคับ (Key Legal Guardrails)"
        subtitle="สรุป 3 เกณฑ์สำคัญที่ต้องตรวจสอบก่อนอนุมัติหรือลงนาม"
        itemCount={guardrails.length}
        itemClassName="sf-slide-item sf-slide-item--third"
      >
        {guardrails.map((g) => (
          <SfCard key={g.title} tone={g.tone} className="h-full flex flex-col justify-between gap-3">
            <div className="space-y-2">
              <SfBadge tone="surface">{g.badge}</SfBadge>
              <h3 className="text-base font-semibold leading-snug">{g.title}</h3>
              <p className="text-xs md:text-sm leading-relaxed opacity-90">{g.body}</p>
            </div>
          </SfCard>
        ))}
      </SlideDeck>

      {/* Analytics + 11 Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SfCard className="space-y-3">
          <div>
            <h3 className="text-base font-semibold">
              ความหนาแน่นภารกิจ (112) และคู่เชื่อมเอกสาร (159) รายคลัสเตอร์
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              ภาพรวมกลุ่มภารกิจหลัก A1–A5 และ B1–B4
            </p>
          </div>
          <div className="relative h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...DB.clusters9]} margin={{ top: 10, right: 10, left: -12, bottom: 8 }}>
                <XAxis dataKey="cluster" tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="missions" name="จำนวนภารกิจ (112)" fill="#28633C" radius={[8, 8, 0, 0]} />
                <Bar
                  dataKey="doc_links_count"
                  name="คู่เชื่อมเอกสาร (159)"
                  fill="#714181"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SfCard>

        <SfCard className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold">
                คลังกฎหมาย สกสว. ทั้ง 12 หมวด (103 ไฟล์จริง / 104 รหัส)
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                แตะที่หมวดเพื่อเปิดดูรายการเอกสารทันที
              </p>
            </div>
            <SfButton variant="secondary" onClick={() => onNavigateTab('repository')}>
              ดูทั้งหมด
            </SfButton>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {DB.categories11.map((cat, idx) => (
              <button
                key={cat.cat_no}
                type="button"
                onClick={() => {
                  onSelectCategory(String(idx + 1));
                  onNavigateTab('repository');
                }}
                className="w-full text-left p-3 rounded-2xl bg-[var(--bg)] hover:bg-[var(--surface-soft)] transition flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--ink)]">{cat.cat_no}</span>
                    <span className="text-xs text-[var(--muted)] truncate">{cat.primary_clusters}</span>
                  </div>
                  <div className="text-sm font-medium text-[var(--ink)] truncate mt-0.5">
                    {cat.cat_name}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <SfBadge tone="mint">{cat.active_count} ไฟล์</SfBadge>
                  <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                </div>
              </button>
            ))}
          </div>
        </SfCard>
      </div>

      {/* Slide Deck 3: V6 TOR 3 Legal Levels */}
      <SlideDeck
        title="โครงสร้างกฎหมาย 3 ระดับตามกรอบ TOR ข้อ 4.1.1 (รุ่น V6)"
        subtitle="เลื่อนซ้าย–ขวาเพื่อดูขอบเขตกฎหมายแม่บท กฎรอง และกฎหมายที่เกี่ยวข้อง (หมวด 12)"
        itemCount={(DB.torLevels3 || []).length}
        itemClassName="sf-slide-item sf-slide-item--third"
      >
        {(DB.torLevels3 || []).map((lvl, idx) => (
          <SfCard
            key={lvl.level_code}
            tone={idx === 0 ? 'sky' : idx === 1 ? 'mint' : 'lilac'}
            className="h-full flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SfBadge tone="surface">{lvl.level_code}</SfBadge>
                <SfBadge tone="surface">{lvl.doc_count}</SfBadge>
              </div>
              <h3 className="text-sm md:text-base font-semibold leading-snug">{lvl.level_name}</h3>
              <p className="text-xs opacity-90 whitespace-pre-line line-clamp-4 leading-relaxed">
                {lvl.core_laws}
              </p>
            </div>
            <div className="pt-2 border-t border-black/10 text-[11px] font-medium opacity-85">
              {lvl.clusters_linked}
            </div>
          </SfCard>
        ))}
      </SlideDeck>

      {/* Slide Deck 4: V6 TOR 6 Deliverables */}
      <SlideDeck
        title="ความก้าวหน้าการส่งมอบงาน 6 ชิ้นตาม TOR (รุ่น V6 · 75–80%)"
        subtitle="เลื่อนซ้าย–ขวาเพื่อดูสถานะผลงานแต่ละชิ้นพร้อมลิงก์เปิดเอกสาร"
        itemCount={(DB.torDeliverables6 || []).length}
        itemClassName="sf-slide-item sf-slide-item--compact"
      >
        {(DB.torDeliverables6 || []).map((deliv) => (
          <SfCard
            key={deliv.deliv_no}
            className="h-full flex flex-col justify-between gap-3 border border-[var(--border)]"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <SfBadge tone="primary">{deliv.deliv_no}</SfBadge>
                <SfBadge tone="positive">{deliv.status}</SfBadge>
              </div>
              <div className="text-[11px] font-semibold text-[var(--muted)]">{deliv.tor_code}</div>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2">{deliv.title}</h3>
              <p className="text-xs text-[var(--muted)] whitespace-pre-line line-clamp-4 leading-relaxed">
                {deliv.key_metrics}
              </p>
            </div>
            <a
              href={deliv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sf-button sf-button--secondary w-full !min-h-[38px] text-xs"
            >
              <span>เปิดเอกสารส่งมอบ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </SfCard>
        ))}
      </SlideDeck>
    </div>
  );
}

