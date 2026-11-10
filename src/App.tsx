import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Layers,
  Menu,
  Scale,
  Search,
  Sparkles,
  Terminal,
  Video,
  X,
} from 'lucide-react';
import { MASTER_BUNDLE as DB } from './data/tsriDatabase';
import {
  AiMessage,
  C1C2ARating,
  LegalDocument,
  PortalTabId,
  SoftFocusTheme,
  VideoClipItem,
} from './types/portal';
import {
  MobileSheetModal,
  SfBadge,
  SfBottomNav,
  SfButton,
  SfSegmented,
} from './components/SoftFocusUI';
import { DashboardTab } from './components/tabs/DashboardTab';
import { RepositoryTab } from './components/tabs/RepositoryTab';
import { ClustersTab } from './components/tabs/ClustersTab';
import { AiAssistantTab } from './components/tabs/AiAssistantTab';
import { Phase3Tab } from './components/tabs/Phase3Tab';
import { Phase4Tab } from './components/tabs/Phase4Tab';
import { DevTab } from './components/tabs/DevTab';

const INITIAL_AI_MESSAGES: AiMessage[] = [
  {
    role: 'assistant',
    title: 'ระบบ AI ผู้ช่วยสืบค้นและวินิจฉัยข้อกฎหมาย สกสว. (TSRI Legal RAG Engine · V6)',
    statutory_basis:
      'ฐานข้อมูลอ้างอิงรุ่น V6 (ความก้าวหน้า 75–80%): คลังข้อมูลกฎหมาย สกสว. ครบ 12 หมวด (103 ไฟล์ใช้งานจริง / 104 รหัสทะเบียน รวม พ.ร.บ.งบประมาณ/การคลัง/พัสดุ) เชื่อมโยง 24 สายโซ่ 3 ระดับ และ 9 Clusters (112 ภารกิจ · 159 คู่เชื่อมเอกสาร)',
    operational_rule:
      'เลือก "มุมมองตามระดับตำแหน่ง (Role Lens)" ด้านบนเพื่อให้ AI ปรับสัดส่วนคำตอบตามอำนาจหน้าที่ (80:20, 60:40, 45:55, 30:70) หรือแตะโจทย์ตัวอย่างเพื่อดูผลวินิจฉัยพร้อมรหัสเอกสารต้นฉบับ',
    checklist: [
      'ค้นหาด้วยคำสำคัญ เช่น "500,000 บาท พด.70/2564", "คำรับรอง มาตรา 18", "คืนเงิน PMU 45 วัน", "ทุน ORG มาตรา 43", "TRIUP มาตรา 8", "ความลับ มาตรา 36" หรือ "พ.ร.บ.วิธีการงบประมาณ / จัดซื้อจัดจ้าง"',
      'ทุกคำตอบอ้างอิงรหัสทะเบียน TSRI-F / DOC-ID พร้อมลิงก์เปิดไฟล์จริงใน Google Drive',
    ],
    docs: ['TSRI-F01-01-001', 'TSRI-F02-01-001', 'TSRI-F04-00-012', 'TSRI-F12-01-001'],
  },
];

export default function App() {
  // Soft Focus Theme State ('sunny' | 'lavender')
  const [theme, setTheme] = useState<SoftFocusTheme>('sunny');

  // Global Navigation & Role Lens State
  const [activeTab, setActiveTab] = useState<PortalTabId>('dashboard');
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [globalSearch, setGlobalSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Tab 2: Legal Repository & Section Explorer State
  const [repoSubView, setRepoSubView] = useState<'files' | 'sections' | 'chains24'>('files');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [selectedTorLevel, setSelectedTorLevel] = useState('ALL');
  const [onlyActiveFiles, setOnlyActiveFiles] = useState(false);
  const [inspectDoc, setInspectDoc] = useState<LegalDocument | null>(null);

  // Tab 3: 9 Clusters & Cross-List 15 State
  const [activeClusterFilter, setActiveClusterFilter] = useState('ALL');
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});
  const [editingNoteCode, setEditingNoteCode] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Tab 4: AI Legal Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiMessages, setAiMessages] = useState<AiMessage[]>(INITIAL_AI_MESSAGES);

  // Tab 5: Phase 3 Fieldwork Toolkit State
  const [fieldSubView, setFieldSubView] = useState<'questions' | 'sampling' | 'fgd' | 'chains'>('questions');
  const [questionGroupFilter, setQuestionGroupFilter] = useState('ALL');
  const [c1c2aRatings, setC1c2aRatings] = useState<Record<string, C1C2ARating>>({});

  // Tab 6: Phase 4 Learning Hub & 30:70 Exam Simulator State
  const [learnSubView, setLearnSubView] = useState<'clips' | 'exam' | 'playbooks' | 'sets'>('clips');
  const [selectedClip, setSelectedClip] = useState<VideoClipItem | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examRoleFilter, setExamRoleFilter] = useState('ALL');

  // Restore saved theme, notes, and C1/C2/A ratings
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('tsri_sf_theme');
      if (savedTheme === 'sunny' || savedTheme === 'lavender') {
        setTheme(savedTheme);
      }
      const savedNotes = localStorage.getItem('tsri_km_notes_v5');
      if (savedNotes) setCustomNotes(JSON.parse(savedNotes));
      const savedRatings = localStorage.getItem('tsri_km_c1c2a_v5');
      if (savedRatings) setC1c2aRatings(JSON.parse(savedRatings));
    } catch {
      // Ignore storage restrictions in sandboxed environments
    }
  }, []);

  // Sync theme to document root for Soft Focus tokens
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('tsri_sf_theme', theme);
    } catch {
      // Ignore storage restrictions
    }
  }, [theme]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 3200);
  };

  const copyText = (text: string, label = 'คัดลอกข้อมูลสำเร็จ') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(label);
    } catch {
      showToast(label);
    }
  };

  const currentRoleObj = useMemo(() => {
    return DB.roleTiers.find((r) => r.id === selectedRole) || DB.roleTiers[0];
  }, [selectedRole]);

  const docLookupMap = useMemo(() => {
    const m: Record<string, LegalDocument> = {};
    DB.documents101.forEach((d) => {
      m[d.tsri_f] = d;
    });
    return m;
  }, []);

  const filteredDocs = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return DB.documents101.filter((d) => {
      if (onlyActiveFiles && !d.is_active) return false;
      if (selectedCat !== 'ALL' && String(d.cat_num) !== String(selectedCat)) return false;
      if (selectedCluster !== 'ALL' && !d.clusters.includes(selectedCluster)) return false;
      if (selectedTorLevel !== 'ALL' && !d.tor_level.includes(selectedTorLevel)) return false;
      if (selectedRole !== 'ALL' && !(d.roles as readonly string[]).includes(selectedRole)) return false;
      if (!q) return true;
      return (
        d.tsri_f.toLowerCase().includes(q) ||
        d.doc_id.toLowerCase().includes(q) ||
        d.file_name.toLowerCase().includes(q) ||
        d.formal_title.toLowerCase().includes(q) ||
        d.key_provisions.toLowerCase().includes(q) ||
        d.legal_basis.toLowerCase().includes(q) ||
        d.clusters.toLowerCase().includes(q) ||
        d.owner_bureau.toLowerCase().includes(q)
      );
    });
  }, [globalSearch, onlyActiveFiles, selectedCat, selectedCluster, selectedTorLevel, selectedRole]);

  const filteredSections = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return DB.statutorySections.filter((s) => {
      if (selectedCluster !== 'ALL' && !s.cluster.includes(selectedCluster)) return false;
      if (!q) return true;
      return (
        s.section.toLowerCase().includes(q) ||
        s.act_name.toLowerCase().includes(q) ||
        s.text.toLowerCase().includes(q) ||
        s.cluster.toLowerCase().includes(q)
      );
    });
  }, [globalSearch, selectedCluster]);

  const filteredCrossList = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return DB.crossList15.filter((cl) => {
      if (activeClusterFilter !== 'ALL' && !cl.cluster.includes(activeClusterFilter)) return false;
      if (!q) return true;
      return (
        cl.cl_code.toLowerCase().includes(q) ||
        cl.cluster.toLowerCase().includes(q) ||
        cl.owner.toLowerCase().includes(q) ||
        cl.phase1_2_legal.toLowerCase().includes(q) ||
        cl.phase3_c1_c2_a.toLowerCase().includes(q) ||
        cl.phase4_media_exam.toLowerCase().includes(q)
      );
    });
  }, [globalSearch, activeClusterFilter]);

  const filteredQuestions = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return DB.interviewQuestions32.filter((item) => {
      if (questionGroupFilter === 'CORE' && !item.q_code.startsWith('Q0') && !item.q_code.startsWith('Q1')) {
        return false;
      }
      if (questionGroupFilter === 'EXEC' && !item.q_code.startsWith('QH')) return false;
      if (questionGroupFilter === 'OPER' && !item.q_code.startsWith('QO')) return false;
      if (!q) return true;
      return (
        item.q_code.toLowerCase().includes(q) ||
        item.question_text.toLowerCase().includes(q) ||
        item.legal_plugin.toLowerCase().includes(q) ||
        item.c1_c2_a_rubric.toLowerCase().includes(q)
      );
    });
  }, [globalSearch, questionGroupFilter]);

  const filteredExams = useMemo(() => {
    return DB.examItems15.filter((ex) => {
      if (examRoleFilter === 'ALL') return true;
      if (examRoleFilter === 'BOARD_TOP' && (ex.cluster_clip.includes('80:20') || ex.cluster_clip.includes('60:40'))) {
        return true;
      }
      if (examRoleFilter === 'MID' && ex.cluster_clip.includes('45:55')) return true;
      if (examRoleFilter === 'OPER' && ex.cluster_clip.includes('30:70')) return true;
      return false;
    });
  }, [examRoleFilter]);

  const examScoreSummary = useMemo(() => {
    let correct = 0;
    filteredExams.forEach((item) => {
      if (examAnswers[item.item_id] === item.correct_answer) correct += 1;
    });
    return {
      total: filteredExams.length,
      answered: Object.keys(examAnswers).filter((k) => filteredExams.some((e) => e.item_id === k)).length,
      correct,
      pct: filteredExams.length > 0 ? Math.round((correct / filteredExams.length) * 100) : 0,
    };
  }, [filteredExams, examAnswers]);

  const handleSaveNote = (clCode: string) => {
    const next = { ...customNotes, [clCode]: noteDraft };
    setCustomNotes(next);
    setEditingNoteCode(null);
    try {
      localStorage.setItem('tsri_km_notes_v5', JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
    showToast(`บันทึกหมายเหตุสำหรับ ${clCode} เรียบร้อยแล้ว`);
  };

  const handleSetRating = (qCode: string, dim: 'C1' | 'C2' | 'A', val: string) => {
    const prev = c1c2aRatings[qCode] || {
      C1: 'ครบถ้วน/สอดคล้อง (Pass)',
      C2: 'ครบถ้วน/สอดคล้อง (Pass)',
      A: 'ครบถ้วน/สอดคล้อง (Pass)',
      gap: 'ไม่พบช่องว่าง',
    };
    const next = { ...c1c2aRatings, [qCode]: { ...prev, [dim]: val } };
    setC1c2aRatings(next);
    try {
      localStorage.setItem('tsri_km_c1c2a_v5', JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
    showToast(`อัปเดตผลประเมิน ${qCode} [${dim}: ${val}]`);
  };

  const handleAskAi = (promptText?: string) => {
    const queryToRun = (promptText ?? aiQuery).trim();
    if (!queryToRun) return;
    const qLower = queryToRun.toLowerCase();

    let bestCard: (typeof DB)['aiKnowledgeBase'][number] | null = null;
    let maxScore = 0;
    DB.aiKnowledgeBase.forEach((card) => {
      let score = 0;
      if (card.title.toLowerCase().includes(qLower)) score += 5;
      card.keywords.forEach((kw) => {
        if (qLower.includes(kw.toLowerCase())) score += 3;
      });
      if (score > maxScore) {
        maxScore = score;
        bestCard = card;
      }
    });

    const matchedDocs = DB.documents101
      .filter(
        (d) =>
          d.file_name.toLowerCase().includes(qLower) ||
          d.formal_title.toLowerCase().includes(qLower) ||
          d.key_provisions.toLowerCase().includes(qLower) ||
          d.tsri_f.toLowerCase().includes(qLower)
      )
      .slice(0, 5);

    let reply: AiMessage;
    if (bestCard) {
      const matched = bestCard as (typeof DB)['aiKnowledgeBase'][number];
      reply = {
        role: 'assistant',
        title: `[มุมมอง ${currentRoleObj.short}] ${matched.title}`,
        statutory_basis: matched.statutory_basis,
        operational_rule: matched.operational_rule,
        checklist: [...matched.checklist],
        docs: [...matched.docs],
      };
    } else if (matchedDocs.length > 0) {
      reply = {
        role: 'assistant',
        title: `[มุมมอง ${currentRoleObj.short}] ผลการสืบค้นและสังเคราะห์ข้อกฎหมายสำหรับ: "${queryToRun}"`,
        statutory_basis: matchedDocs.map((d) => `• ${d.tsri_f} (${d.doc_id}): ${d.legal_basis}`).join('\n'),
        operational_rule: matchedDocs.map((d) => `• [${d.cat_label}] ${d.formal_title}: ${d.key_provisions}`).join('\n'),
        checklist: [
          `ตรวจสอบความสอดคล้องตามสัดส่วนความรู้ของบทบาท (${currentRoleObj.ratio})`,
          'ตรวจสอบวันที่มีผลใช้บังคับของระเบียบ/ประกาศให้ตรงกับวันที่เกิดเหตุจริง',
          'จัดเก็บหลักฐานเชิงประจักษ์ (D5) ในแฟ้มงานหรือระบบ NRIIS/STARS เพื่อรองรับการตรวจ C1/C2/A',
        ],
        docs: matchedDocs.map((d) => d.tsri_f),
      };
    } else {
      reply = {
        role: 'assistant',
        title: `[มุมมอง ${currentRoleObj.short}] สรุปกรอบอำนาจหน้าที่และแนวปฏิบัติสำหรับ: "${queryToRun}"`,
        statutory_basis:
          'อ้างอิงกรอบกฎหมาย 3 ระดับตาม TOR ข้อ 4.1.1: ระดับที่ 1 พ.ร.บ.สภานโยบายฯ พ.ศ. 2562 (ม.11, 41, 44, 47, 50) ↔ ระดับที่ 3 พ.ร.บ.การส่งเสริม ววน. พ.ศ. 2562 (ม.6–39) และ พ.ร.บ.ส่งเสริมการใช้ประโยชน์ฯ พ.ศ. 2564 (TRIUP)',
        operational_rule: `สำหรับบทบาท ${currentRoleObj.name} (สัดส่วนความรู้ ${currentRoleObj.ratio}): ${currentRoleObj.decision_focus}`,
        checklist: [
          'ขั้นที่ 1 (Legal Basis): ระบุมาตราตั้งต้นว่าผู้มีอำนาจอนุมัติคือ สภานโยบายฯ, กสว. (ม.44), อนก.สกสว. (ม.47) หรือ ผอ.สกสว. (ม.50)',
          'ขั้นที่ 2 (Conditions & Exceptions): ตรวจเงื่อนไขบังคับและข้อห้าม (เช่น ห้ามทำวิจัยแข่งขันกับหน่วยรับงบตาม ม.43 วรรคสอง)',
          'ขั้นที่ 3 (SOP & Evidence): ตรวจคู่มือหมวด 9, คำสั่งมอบอำนาจ พด.70–71/2564 และ SOP จัดสรรงบ (TSRI-F11-00-001)',
        ],
        docs: [...currentRoleObj.must_know_docs],
      };
    }

    setAiMessages((prev) => [...prev, { role: 'user', text: queryToRun }, reply]);
    if (!promptText) setAiQuery('');
  };

  const navItems: Array<{ id: PortalTabId; label: string; shortLabel: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: '1. ภาพรวมบทบาท', shortLabel: 'หน้าหลัก', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'repository', label: `2. คลังกฎหมาย (${filteredDocs.length})`, shortLabel: 'คลัง กม.', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'clusters', label: '3. 9 คลัสเตอร์', shortLabel: 'คลัสเตอร์', icon: <Layers className="w-4 h-4" /> },
    { id: 'ai', label: '4. AI วินิจฉัย', shortLabel: 'AI ช่วย', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'phase3', label: '5. ภาคสนาม (80)', shortLabel: 'ภาคสนาม', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'phase4', label: '6. สื่อ & สอบ 30:70', shortLabel: 'สอบ 30:70', icon: <Video className="w-4 h-4" /> },
    { id: 'dev', label: '7. Cloudflare Dev', shortLabel: 'Dev', icon: <Terminal className="w-4 h-4" /> },
  ];

  const mobileBottomValue: PortalTabId | 'more' =
    activeTab === 'dashboard' || activeTab === 'repository' || activeTab === 'ai' || activeTab === 'phase4'
      ? activeTab
      : 'more';

  const navigateAndCloseSheet = (tab: PortalTabId) => {
    setActiveTab(tab);
    setMoreSheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Toast Notification Pill */}
      {toastMsg && (
        <div
          role="status"
          className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--ink)] text-[var(--surface)] text-xs md:text-sm font-medium max-w-[calc(100%-32px)] w-max bottom-[calc(92px+env(safe-area-inset-bottom))] md:bottom-6"
        >
          <CheckCircle2 className="w-4 h-4 text-[var(--mint)] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="sf-shell">
        {/* Soft Focus Masthead */}
        <header className="py-5 md:py-6 border-b border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between gap-3">
            {/* Wordmark */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-full grid place-items-center shrink-0"
                style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
              >
                <Scale className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base md:text-lg font-semibold tracking-tight truncate">
                  TSRI Legal Portal
                </div>
                <div className="text-[11px] text-[var(--muted)] truncate">
                  สกสว. 12 หมวด · 103 ไฟล์ · รุ่น V6 (Soft Focus UI)
                </div>
              </div>
            </div>

            {/* Theme Switcher (Sunny / Lavender) */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden md:inline text-xs text-[var(--muted)]">ธีม</span>
              <SfSegmented
                label="เลือกธีมสี"
                value={theme}
                onChange={setTheme}
                options={[
                  { value: 'sunny', label: 'Sunny' },
                  { value: 'lavender', label: 'Lavender' },
                ]}
              />
            </div>
          </div>

          {/* Desktop Navigation Pills */}
          <nav className="sf-desktop-nav" aria-label="เมนูหลัก">
            {navItems.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(tab.id)}
                  className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition cursor-pointer"
                  style={{
                    background: isActive ? 'var(--surface)' : 'transparent',
                    color: isActive ? 'var(--ink)' : 'var(--muted)',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Bar + Horizontal Swipeable Role Lens Strip */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="ค้นหารหัสเอกสาร, มาตรา, คำสำคัญ (เช่น พด.70, ม.18, TRIUP)..."
                  className="sf-input !pl-10 !pr-10 !rounded-full text-sm"
                />
                {globalSearch && (
                  <button
                    type="button"
                    onClick={() => setGlobalSearch('')}
                    aria-label="ล้างคำค้นหา"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full grid place-items-center text-[var(--muted)] hover:bg-[var(--surface-soft)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <a
                href={DB.links.ROOT_DB}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-button sf-button--secondary shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิด Drive 12 หมวด (V6)</span>
              </a>
            </div>

            {/* Horizontal Swipeable Role Lens Pills */}
            <div className="sf-pill-scroll" role="group" aria-label="เลือกมุมมองตามระดับตำแหน่ง">
              {DB.roleTiers.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className="sf-pill-chip"
                  aria-pressed={selectedRole === role.id}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <span>{role.short}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-6">
          {activeTab === 'dashboard' && (
            <DashboardTab
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
              currentRoleObj={currentRoleObj}
              onNavigateTab={navigateAndCloseSheet}
              onSelectCategory={(catIdx) => setSelectedCat(catIdx)}
              onInspectDocByCode={(code) => {
                const doc = docLookupMap[code];
                if (doc) setInspectDoc(doc);
              }}
            />
          )}

          {activeTab === 'repository' && (
            <RepositoryTab
              repoSubView={repoSubView}
              setRepoSubView={setRepoSubView}
              selectedCat={selectedCat}
              setSelectedCat={setSelectedCat}
              selectedCluster={selectedCluster}
              setSelectedCluster={setSelectedCluster}
              selectedTorLevel={selectedTorLevel}
              setSelectedTorLevel={setSelectedTorLevel}
              onlyActiveFiles={onlyActiveFiles}
              setOnlyActiveFiles={setOnlyActiveFiles}
              globalSearch={globalSearch}
              onClearAllFilters={() => {
                setSelectedCat('ALL');
                setSelectedCluster('ALL');
                setSelectedTorLevel('ALL');
                setOnlyActiveFiles(false);
                setGlobalSearch('');
              }}
              filteredDocs={filteredDocs}
              filteredSections={filteredSections}
              onInspectDoc={setInspectDoc}
            />
          )}

          {activeTab === 'clusters' && (
            <ClustersTab
              activeClusterFilter={activeClusterFilter}
              setActiveClusterFilter={setActiveClusterFilter}
              filteredCrossList={filteredCrossList}
              customNotes={customNotes}
              editingNoteCode={editingNoteCode}
              setEditingNoteCode={setEditingNoteCode}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onSaveNote={handleSaveNote}
            />
          )}

          {activeTab === 'ai' && (
            <AiAssistantTab
              currentRoleObj={currentRoleObj}
              aiQuery={aiQuery}
              setAiQuery={setAiQuery}
              aiMessages={aiMessages}
              onResetAi={() => setAiMessages([INITIAL_AI_MESSAGES[0]])}
              onAskAi={handleAskAi}
              docLookupMap={docLookupMap}
              onInspectDoc={setInspectDoc}
            />
          )}

          {activeTab === 'phase3' && (
            <Phase3Tab
              fieldSubView={fieldSubView}
              setFieldSubView={setFieldSubView}
              questionGroupFilter={questionGroupFilter}
              setQuestionGroupFilter={setQuestionGroupFilter}
              filteredQuestions={filteredQuestions}
              c1c2aRatings={c1c2aRatings}
              onSetRating={handleSetRating}
            />
          )}

          {activeTab === 'phase4' && (
            <Phase4Tab
              learnSubView={learnSubView}
              setLearnSubView={setLearnSubView}
              onSelectClip={setSelectedClip}
              examRoleFilter={examRoleFilter}
              setExamRoleFilter={setExamRoleFilter}
              filteredExams={filteredExams}
              examAnswers={examAnswers}
              setExamAnswers={setExamAnswers}
              examSubmitted={examSubmitted}
              setExamSubmitted={setExamSubmitted}
              examScoreSummary={examScoreSummary}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'dev' && <DevTab onCopyText={copyText} />}
        </main>

        {/* Soft Focus Footer */}
        <footer className="mt-10 pt-5 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-[var(--muted)]">
          <span>TSRI Legal &amp; Competency Portal · PRJ-TSRI-2569-001</span>
          <span>Soft Focus UI · Cloudflare Pages + D1 Ready</span>
        </footer>
      </div>

      {/* Mobile Floating Pill Bottom Navigation */}
      <div className="sf-mobile-bottom">
        <SfBottomNav
          value={mobileBottomValue}
          onChange={(val) => {
            if (val === 'more') {
              setMoreSheetOpen(true);
            } else {
              navigateAndCloseSheet(val);
            }
          }}
          items={[
            { value: 'dashboard', label: 'หน้าหลัก', icon: <BarChart3 className="w-5 h-5" /> },
            { value: 'repository', label: 'คลัง กม.', icon: <BookOpen className="w-5 h-5" /> },
            { value: 'ai', label: 'AI ช่วย', icon: <Sparkles className="w-5 h-5" /> },
            { value: 'phase4', label: 'สอบ 30:70', icon: <Video className="w-5 h-5" /> },
            { value: 'more', label: 'เพิ่มเติม', icon: <Menu className="w-5 h-5" /> },
          ]}
        />
      </div>

      {/* Mobile "More Menu" Slide-up Sheet */}
      <MobileSheetModal
        open={moreSheetOpen}
        onClose={() => setMoreSheetOpen(false)}
        title="เมนูเพิ่มเติมและเครื่องมือทั้งหมด"
        badge={<SfBadge tone="primary">TSRI Mobile Navigation</SfBadge>}
      >
        <div className="grid grid-cols-1 gap-2.5">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={`drawer-${item.id}`}
                type="button"
                onClick={() => navigateAndCloseSheet(item.id)}
                className="w-full p-4 rounded-2xl text-left flex items-center justify-between gap-3 transition cursor-pointer"
                style={{
                  background: active ? 'var(--primary)' : 'var(--surface)',
                  color: active ? 'var(--on-primary)' : 'var(--ink)',
                  border: '1px solid var(--border)',
                }}
              >
                <span className="inline-flex items-center gap-3 font-semibold text-sm">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {active && <SfBadge tone="surface">กำลังเปิด</SfBadge>}
              </button>
            );
          })}
        </div>
      </MobileSheetModal>

      {/* Bottom Sheet / Modal: Document Details */}
      <MobileSheetModal
        open={Boolean(inspectDoc)}
        onClose={() => setInspectDoc(null)}
        title={inspectDoc?.formal_title ?? ''}
        badge={
          inspectDoc && (
            <>
              <SfBadge tone="primary">
                <span className="font-mono">
                  {inspectDoc.tsri_f} ({inspectDoc.doc_id})
                </span>
              </SfBadge>
              <SfBadge tone="mint">{inspectDoc.cat_label}</SfBadge>
            </>
          )
        }
        footer={
          inspectDoc && (
            <>
              <SfButton
                variant="secondary"
                onClick={() =>
                  copyText(`${inspectDoc.tsri_f}: ${inspectDoc.formal_title} (${inspectDoc.url})`)
                }
              >
                <Copy className="w-4 h-4" />
                <span>คัดลอกการอ้างอิง</span>
              </SfButton>
              <a
                href={inspectDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-button"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิดไฟล์ใน Google Drive</span>
              </a>
            </>
          )
        }
      >
        {inspectDoc && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[var(--muted)] block mb-0.5">ระดับตามกรอบ TOR 4.1.1</span>
                <strong className="text-[var(--ink)]">{inspectDoc.tor_level}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[var(--muted)] block mb-0.5">Clusters &amp; สำนักเจ้าภาพ</span>
                <strong className="text-[var(--positive)]">
                  {inspectDoc.clusters} ({inspectDoc.owner_bureau})
                </strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--sky)] space-y-1">
              <div className="font-semibold text-[var(--ink)]">ฐานอำนาจและกฎหมายที่เชื่อมโยง</div>
              <p className="leading-relaxed opacity-90">{inspectDoc.legal_basis}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--lilac)] space-y-1">
              <div className="font-semibold text-[var(--ink)]">
                สาระสำคัญ เงื่อนไข และเพดานตัวเลขบังคับ
              </div>
              <p className="leading-relaxed opacity-90">{inspectDoc.key_provisions}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--muted)] pt-1">
              <span>ไฟล์: {inspectDoc.file_name}</span>
              <span>
                {inspectDoc.pages} หน้า · SHA-256: {inspectDoc.sha256}
              </span>
            </div>
          </div>
        )}
      </MobileSheetModal>

      {/* Bottom Sheet / Modal: Video Clip Storyboard */}
      <MobileSheetModal
        open={Boolean(selectedClip)}
        onClose={() => setSelectedClip(null)}
        title={selectedClip?.title ?? ''}
        badge={
          selectedClip && (
            <>
              <SfBadge tone="primary">
                <span className="font-mono">{selectedClip.clip_code}</span>
              </SfBadge>
              <SfBadge tone="mint">
                {selectedClip.target_role} ({selectedClip.ratio})
              </SfBadge>
            </>
          )
        }
        footer={
          selectedClip && (
            <SfButton
              variant="ink"
              onClick={() => {
                setSelectedClip(null);
                setLearnSubView('exam');
              }}
            >
              ไปที่ข้อสอบคู่ขนาน ({selectedClip.exam_link})
            </SfButton>
          )
        }
      >
        {selectedClip && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--sky)] space-y-1">
              <div className="font-semibold">วัตถุประสงค์การเรียนรู้เชิงสมรรถนะ</div>
              <p className="leading-relaxed opacity-90">{selectedClip.learning_objective}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--mint)] space-y-1">
              <div className="font-semibold">โครงสร้างบทและลำดับการเล่าเรื่อง (Storyboard)</div>
              <p className="whitespace-pre-line leading-relaxed opacity-90">
                {selectedClip.storyboard}
              </p>
            </div>
            <div className="text-[11px] font-mono text-[var(--muted)]">
              เอกสารอ้างอิง: {selectedClip.linked_docs} | ข้อสอบคู่ขนาน: {selectedClip.exam_link}
            </div>
          </div>
        )}
      </MobileSheetModal>
    </div>
  );
}
