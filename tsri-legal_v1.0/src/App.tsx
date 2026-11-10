import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, BookOpen, Shield, Scale, Layers, FileText, Users, Video,
  CheckCircle2, AlertTriangle, HelpCircle, Sparkles, ExternalLink,
  Filter, ChevronRight, ChevronDown, Award, Terminal, Database,
  Cpu, Cloud, FolderGit2, Copy, Check, RefreshCw, Sliders, Eye,
  ClipboardCheck, BarChart3, PieChart as PieChartIcon, Play, Info, X
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';

import { MASTER_BUNDLE as DB } from './data/tsriDatabase';

const CHART_COLORS = ['#1B365D', '#0D5C63', '#D97706', '#2B4C7E', '#059669', '#7C3AED', '#DC2626', '#2563EB', '#475569'];

export default function App() {
  // Global Navigation & Role Lens State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [globalSearch, setGlobalSearch] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  // Tab 2: Legal Repository & Section Explorer State
  const [repoSubView, setRepoSubView] = useState('files'); // 'files' | 'sections'
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [selectedTorLevel, setSelectedTorLevel] = useState('ALL');
  const [onlyActiveFiles, setOnlyActiveFiles] = useState(false);
  const [inspectDoc, setInspectDoc] = useState(null);

  // Tab 3: 9 Clusters & Cross-List 15 State
  const [activeClusterFilter, setActiveClusterFilter] = useState('ALL');
  const [customNotes, setCustomNotes] = useState({});
  const [editingNoteCode, setEditingNoteCode] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Tab 4: AI Legal Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      title: 'ระบบ AI ผู้ช่วยสืบค้นและวินิจฉัยข้อกฎหมาย สกสว. (TSRI Legal RAG Engine)',
      statutory_basis: 'ฐานข้อมูลอ้างอิงรุ่น V6 (ความก้าวหน้า 75–80% รอรับรอง G2): คลังข้อมูลกฎหมาย สกสว. ครบ 12 หมวด (103 ไฟล์ใช้งานจริง / 104 รหัสทะเบียน รวมหมวด 12 กฎหมายงบประมาณ/การคลัง/พัสดุ) เชื่อมโยง 3 ระดับ (24 สายโซ่) และ 9 Clusters ตามกรอบ TOR-PROJ-001-2569',
      operational_rule: 'ท่านสามารถเลือก "มุมมองตามระดับตำแหน่ง (Role Lens)" ด้านบนเพื่อให้ AI ปรับสัดส่วนคำตอบตามอำนาจหน้าที่ (คณะกรรมการ 80:20, ผู้บริหารระดับสูง 60:40, ผู้บริหารระดับกลาง 45:55, ผู้บริหารระดับต้นและผู้ปฏิบัติงาน 30:70) หรือคลิกโจทย์ตัวอย่างด้านซ้ายเพื่อดูผลการวินิจฉัยพร้อมรหัสเอกสารต้นฉบับได้ทันที',
      checklist: [
        'ค้นหาด้วยคำสำคัญ เช่น "500,000 บาท พด.70/2564", "คำรับรอง มาตรา 18", "คืนเงิน PMU 45 วัน", "ทุน ORG มาตรา 43", "TRIUP มาตรา 8", "ความลับ มาตรา 36" หรือ "ปิดงบ 90 วัน 180 วัน"',
        'ทุกคำตอบอ้างอิงรหัสทะเบียน TSRI-F / DOC-ID พร้อมลิงก์เปิดไฟล์จริงใน Google Drive',
      ],
      docs: ['TSRI-F01-01-001', 'TSRI-F02-01-001', 'TSRI-F04-00-012', 'TSRI-F11-00-001'],
    }
  ]);

  // Tab 5: Phase 3 Fieldwork Toolkit State
  const [fieldSubView, setFieldSubView] = useState('questions'); // 'questions' | 'sampling' | 'fgd' | 'chains'
  const [questionGroupFilter, setQuestionGroupFilter] = useState('ALL');
  const [c1c2aRatings, setC1c2aRatings] = useState({});

  // Tab 6: Phase 4 Learning Hub & 30:70 Exam Simulator State
  const [learnSubView, setLearnSubView] = useState('clips'); // 'clips' | 'exam' | 'playbooks' | 'sets'
  const [selectedClip, setSelectedClip] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examRoleFilter, setExamRoleFilter] = useState('ALL');

  // Load saved custom notes & C1/C2/A ratings from localStorage safely
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('tsri_km_notes_v5');
      if (savedNotes) setCustomNotes(JSON.parse(savedNotes));
      const savedRatings = localStorage.getItem('tsri_km_c1c2a_v5');
      if (savedRatings) setC1c2aRatings(JSON.parse(savedRatings));
    } catch (e) {
      // Ignore storage restrictions in sandboxed iframe
    }
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const copyText = (text, label = 'คัดลอกข้อมูลสำเร็จ') => {
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
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(label);
    }
  };

  const currentRoleObj = useMemo(() => {
    return DB.roleTiers.find((r) => r.id === selectedRole) || DB.roleTiers[0];
  }, [selectedRole]);

  // Filtered 101 Documents
  const filteredDocs = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return DB.documents101.filter((d) => {
      if (onlyActiveFiles && !d.is_active) return false;
      if (selectedCat !== 'ALL' && String(d.cat_num) !== String(selectedCat)) return false;
      if (selectedCluster !== 'ALL' && !d.clusters.includes(selectedCluster)) return false;
      if (selectedTorLevel !== 'ALL' && !d.tor_level.includes(selectedTorLevel)) return false;
      if (selectedRole !== 'ALL' && !d.roles.includes(selectedRole)) return false;
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

  // Filtered Statutory Sections
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

  // Filtered Cross-List 15
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

  // Filtered Interview Questions 32
  const filteredQuestions = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return DB.interviewQuestions32.filter((item) => {
      if (questionGroupFilter === 'CORE' && !item.q_code.startsWith('Q0') && !item.q_code.startsWith('Q1')) return false;
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

  // Filtered Exam Items 15
  const filteredExams = useMemo(() => {
    return DB.examItems15.filter((ex) => {
      if (examRoleFilter === 'ALL') return true;
      if (examRoleFilter === 'BOARD_TOP' && (ex.cluster_clip.includes('80:20') || ex.cluster_clip.includes('60:40'))) return true;
      if (examRoleFilter === 'MID' && ex.cluster_clip.includes('45:55')) return true;
      if (examRoleFilter === 'OPER' && ex.cluster_clip.includes('30:70')) return true;
      return false;
    });
  }, [examRoleFilter]);

  // Save custom note on Cross-List item
  const handleSaveNote = (clCode) => {
    const next = { ...customNotes, [clCode]: noteDraft };
    setCustomNotes(next);
    setEditingNoteCode(null);
    try {
      localStorage.setItem('tsri_km_notes_v5', JSON.stringify(next));
    } catch (e) {}
    showToast(`บันทึกหมายเหตุสำหรับ ${clCode} เรียบร้อยแล้ว`);
  };

  // Toggle C1/C2/A status in Phase 3 simulator
  const handleSetRating = (qCode, dim, val) => {
    const prev = c1c2aRatings[qCode] || { C1: 'ครบถ้วน (Pass)', C2: 'สอดคล้อง (Compliant)', A: 'เหมาะสม (Appropriate)', gap: 'ไม่พบช่องว่าง' };
    const next = { ...c1c2aRatings, [qCode]: { ...prev, [dim]: val } };
    setC1c2aRatings(next);
    try {
      localStorage.setItem('tsri_km_c1c2a_v5', JSON.stringify(next));
    } catch (e) {}
    showToast(`อัปเดตผลประเมิน ${qCode} [${dim}: ${val}]`);
  };

  // Run AI RAG Search & Decision Synthesis
  const handleAskAi = (promptText) => {
    const queryToRun = (promptText ?? aiQuery).trim();
    if (!queryToRun) return;
    const qLower = queryToRun.toLowerCase();

    // 1. Match from curated AI_KNOWLEDGE_BASE
    let bestCard = null;
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

    // 2. Also search matching documents & sections
    const matchedDocs = DB.documents101
      .filter(
        (d) =>
          d.file_name.toLowerCase().includes(qLower) ||
          d.formal_title.toLowerCase().includes(qLower) ||
          d.key_provisions.toLowerCase().includes(qLower) ||
          d.tsri_f.toLowerCase().includes(qLower)
      )
      .slice(0, 5);

    let reply;
    if (bestCard) {
      reply = {
        role: 'assistant',
        title: `[มุมมอง ${currentRoleObj.short}] ${bestCard.title}`,
        statutory_basis: bestCard.statutory_basis,
        operational_rule: bestCard.operational_rule,
        checklist: bestCard.checklist,
        docs: bestCard.docs,
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
        statutory_basis: `อ้างอิงกรอบกฎหมาย 3 ระดับตาม TOR ข้อ 4.1.1: ระดับที่ 1 พ.ร.บ.สภานโยบายฯ พ.ศ. 2562 (ม.11, 41, 44, 47, 50) ↔ ระดับที่ 3 พ.ร.บ.การส่งเสริม ววน. พ.ศ. 2562 (ม.6–39) และ พ.ร.บ.ส่งเสริมการใช้ประโยชน์ฯ พ.ศ. 2564 (TRIUP)`,
        operational_rule: `สำหรับบทบาท ${currentRoleObj.name} (สัดส่วนความรู้ ${currentRoleObj.ratio}): ${currentRoleObj.decision_focus}`,
        checklist: [
          'ขั้นที่ 1 (Legal Basis): ระบุมาตราตั้งต้นว่าผู้มีอำนาจอนุมัติคือ สภานโยบายฯ, กสว. (ม.44), อนก.สกสว. (ม.47) หรือ ผอ.สกสว. (ม.50)',
          'ขั้นที่ 2 (Conditions & Exceptions): ตรวจเงื่อนไขบังคับและข้อห้าม (เช่น ห้ามทำวิจัยแข่งขันกับหน่วยรับงบตาม ม.43 วรรคสอง)',
          'ขั้นที่ 3 (SOP & Evidence): ตรวจคู่มือหมวด 9, คำสั่งมอบอำนาจ พด.70–71/2564 และ SOP จัดสรรงบ (TSRI-F11-00-001)',
        ],
        docs: currentRoleObj.must_know_docs,
      };
    }

    setAiMessages((prev) => [...prev, { role: 'user', text: queryToRun }, reply]);
    if (!promptText) setAiQuery('');
  };

  // Compute Exam Score
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

  const docLookupMap = useMemo(() => {
    const m = {};
    DB.documents101.forEach((d) => {
      m[d.tsri_f] = d;
    });
    return m;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-amber-400/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Executive Header */}
      <header className="bg-gradient-to-r from-[#0F1E36] via-[#1B365D] to-[#0D5C63] text-white shadow-lg border-b border-amber-400/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-amber-300 uppercase mb-1">
                <span className="bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                  PRJ-TSRI-2569-001 · TOR-PROJ-001-2569
                </span>
                <span>รุ่น V6 (ความก้าวหน้า 75–80% รอรับรอง G2) · คลังข้อมูลกฎหมาย สกสว. 12 หมวด (103 ไฟล์ใช้งานจริง / 104 รหัสทะเบียน)</span>
                <span>·</span>
                <span>Cloudflare Pages + Workers AI + D1 Ready</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <Scale className="w-7 h-7 text-amber-400 shrink-0" />
                <span>ระบบฐานข้อมูลและสืบค้นกฎหมายตามอำนาจหน้าที่ สกสว. (TSRI Legal &amp; Competency Intelligence Portal)</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-200 mt-1">
                เครื่องมือสนับสนุนการตัดสินใจและปฏิบัติงานตามระดับตำแหน่ง (คณะกรรมการ 80:20 · ผู้บริหารสูง 60:40 · ผู้บริหารกลาง 45:55 · ต้นและปฏิบัติการ 30:70)
              </p>
            </div>

            {/* Global Search & Quick Links */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative min-w-[260px] md:min-w-[320px]">
                <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="ค้นหารหัสเอกสาร, มาตรา, คำสำคัญ (เช่น พด.70, ม.18, TRIUP)..."
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-white/10 border border-white/25 text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {globalSearch && (
                  <button
                    type="button"
                    onClick={() => setGlobalSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                    title="ล้างคำค้นหา"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <a
                href={DB.links.ROOT_DB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition shrink-0 shadow"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิดคลัง Drive 12 หมวด (V6)</span>
              </a>
            </div>
          </div>

          {/* Role Lens Switcher Bar (5 Target User Tiers) */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-200 font-medium">
              <Users className="w-4 h-4 text-amber-400" />
              <span>เลือกมุมมองตามระดับผู้ใช้งาน (Role-Based Lens):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DB.roleTiers.map((role) => {
                const active = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-white'
                        : 'bg-white/10 text-slate-100 hover:bg-white/20'
                    }`}
                  >
                    <span>{role.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="mt-4 flex flex-wrap gap-1.5 border-b border-white/10 pb-1">
            {[
              { id: 'dashboard', label: '1. ศูนย์บัญชาการตามบทบาท', icon: BarChart3 },
              { id: 'repository', label: `2. สืบค้นคลัง 12 หมวด (${filteredDocs.length}/104 รหัส)`, icon: BookOpen },
              { id: 'clusters', label: '3. แผนผัง 9 คลัสเตอร์ & Cross-List 15', icon: Layers },
              { id: 'ai', label: '4. AI ผู้ช่วยวินิจฉัยกฎหมาย (RAG)', icon: Sparkles },
              { id: 'phase3', label: '5. เครื่องมือระยะที่ 3 (80 คน · C1/C2/A)', icon: ClipboardCheck },
              { id: 'phase4', label: '6. สื่อ 15 คลิป & สอบสมรรถนะ 30:70', icon: Video },
              { id: 'dev', label: '7. ชุดโค้ด Antigravity IDE (V6)', icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg text-xs md:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-50 text-[#1B365D] shadow-sm'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Active Role Context Banner */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 mt-0.5 ${currentRoleObj.badge_color}`}>
              สัดส่วนความรู้ {currentRoleObj.ratio}
            </span>
            <div className="text-xs md:text-sm">
              <div className="font-bold text-slate-900">{currentRoleObj.name}</div>
              <div className="text-slate-600 mt-0.5">
                <strong className="text-slate-800">จุดเน้นการตัดสินใจและปฏิบัติงาน:</strong> {currentRoleObj.decision_focus}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 font-medium">เอกสารสำคัญประจำบทบาท:</span>
            {currentRoleObj.must_know_docs.slice(0, 4).map((code) => {
              const docObj = docLookupMap[code];
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    if (docObj) setInspectDoc(docObj);
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-blue-800 border border-slate-300 text-xs font-mono font-semibold transition"
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ================================================================= */}
        {/* TAB 1: DASHBOARD & ROLE-BASED COMMAND CENTER                      */}
        {/* ================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>คลังข้อมูลกฎหมาย สกสว. (ครบ 12 หมวด · รุ่น V6)</span>
                  <BookOpen className="w-5 h-5 text-[#1B365D]" />
                </div>
                <div className="text-2xl font-extrabold text-[#1B365D] mt-2">103 ไฟล์ใช้งานจริง</div>
                <div className="text-xs text-emerald-700 font-medium mt-1">
                  104 รหัสทะเบียน (รวมหมวด 12 กม.เกี่ยวข้อง 3 ไฟล์ · ด่าน G1 80% / รอ G2 75%)
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>กรอบภารกิจ 9 คลัสเตอร์ (A1–A5, B1–B4)</span>
                  <Layers className="w-5 h-5 text-[#0D5C63]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0D5C63] mt-2">112 ภารกิจ · 159 คู่เชื่อม</div>
                <div className="text-xs text-slate-600 mt-1">
                  ครอบคลุม 27 กระบวนงาน (P01–P27) และ Cross-List 15 ข้อ
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>ชุดเครื่องมือภาคสนามระยะที่ 3 (C1/C2/A)</span>
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-amber-700 mt-2">80 คน (ไม่นับซ้ำ)</div>
                <div className="text-xs text-slate-600 mt-1">
                  คำถามสัมภาษณ์ 32 ข้อ · 6 FGD · 6 สายงานตรวจแฟ้มจริง
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>สื่อการเรียนรู้และข้อสอบระยะที่ 4 (TOR 8.1.3)</span>
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 mt-2">15 คลิป · ข้อสอบ 12 ชุด</div>
                <div className="text-xs text-slate-600 mt-1">
                  คัมภีร์กฎหมาย 2 ฉบับ · อินโฟกราฟิก 8 ชิ้น · Scenario 30:70
                </div>
              </div>
            </div>

            {/* Role-Based Authority & Decision Support Matrix (5 Tiers) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-[#1B365D] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span>เมทริกซ์องค์ความรู้และการใช้ข้อมูลตามระดับอำนาจหน้าที่ (Role-Based Knowledge &amp; Decision Matrix)</span>
                  </h2>
                  <p className="text-xs text-slate-600">
                    คลิกที่การ์ดแต่ละระดับเพื่อสลับมุมมองการสืบค้นข้อมูลและปรับสัดส่วนการวิเคราะห์ของ AI ให้ตรงตามระดับการปฏิบัติงานจริง
                  </p>
                </div>
                <a
                  href={DB.links.MASTER_DB_V03}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>เปิดฐานข้อมูลวิจัย v0.3 ต้นฉบับ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {DB.roleTiers.slice(1).map((tier) => {
                  const isSelected = selectedRole === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedRole(tier.id)}
                      className={`cursor-pointer rounded-xl p-3.5 border transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#1B365D] bg-blue-50/60 ring-2 ring-[#1B365D]'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${tier.badge_color}`}>
                            {tier.ratio}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            กม.แม่บท {tier.statutory_pct}% : กฎรอง {tier.operational_pct}%
                          </span>
                        </div>
                        <div className="font-bold text-xs md:text-sm text-slate-900 mb-1.5">{tier.name}</div>
                        <p className="text-xs text-slate-600 line-clamp-4">{tier.authority_scope}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/80">
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                          <div
                            className="bg-[#1B365D] h-full"
                            style={{ width: `${tier.statutory_pct}%` }}
                            title={`กฎหมายแม่บท ${tier.statutory_pct}%`}
                          />
                          <div
                            className="bg-amber-500 h-full"
                            style={{ width: `${tier.operational_pct}%` }}
                            title={`กฎรอง/คู่มือ/SOP ${tier.operational_pct}%`}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                          <span>แม่บท {tier.statutory_pct}%</span>
                          <span>ปฏิบัติการ {tier.operational_pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Charts Row: 9 Clusters & 11 Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm md:text-base font-bold text-[#1B365D] mb-1">
                  ความหนาแน่นของภารกิจ (112 ภารกิจ) และคู่เชื่อมเอกสาร (159 คู่เชื่อม) แยกตาม 9 คลัสเตอร์
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  คลิกเลือกคลัสเตอร์ในแท็บที่ 2 หรือ 3 เพื่อเจาะลึกเอกสารต้นฉบับในแต่ละกลุ่มภารกิจ
                </p>
                <div className="relative h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DB.clusters9} margin={{ top: 10, right: 15, left: 0, bottom: 10 }}>
                      <XAxis dataKey="cluster" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="missions" name="จำนวนภารกิจ (รวม 112)" fill="#0D5C63" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="doc_links" name="คู่เชื่อมเอกสาร (รวม 159)" fill="#1B365D" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm md:text-base font-bold text-[#1B365D] mb-1">
                  โครงสร้างคลังข้อมูลกฎหมาย สกสว. ทั้ง 12 หมวด (103 ไฟล์ใช้งานจริง / 104 รหัสทะเบียน · รุ่น V6)
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  คลิกที่แต่ละหมวดเพื่อเปิดดูรายการเอกสารในหมวดนั้นทันที
                </p>
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <th className="py-2 px-2.5">หมวด</th>
                        <th className="py-2 px-2.5">ชื่อหมวดเอกสาร</th>
                        <th className="py-2 px-2.5 text-center">ใช้งานจริง</th>
                        <th className="py-2 px-2.5">Clusters</th>
                        <th className="py-2 px-2.5 text-center"> действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {DB.categories11.map((cat, idx) => (
                        <tr key={cat.cat_no} className="hover:bg-blue-50/50">
                          <td className="py-2 px-2.5 font-bold text-[#1B365D] whitespace-nowrap">{cat.cat_no}</td>
                          <td className="py-2 px-2.5 font-medium text-slate-800">{cat.cat_name}</td>
                          <td className="py-2 px-2.5 text-center font-semibold text-emerald-700">
                            {cat.active_count} ไฟล์
                          </td>
                          <td className="py-2 px-2.5 text-slate-600">{cat.primary_clusters}</td>
                          <td className="py-2 px-2.5 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCat(String(idx + 1));
                                setActiveTab('repository');
                              }}
                              className="px-2 py-1 rounded bg-[#1B365D] text-white hover:bg-blue-800 text-[11px] font-semibold"
                            >
                              ดูเอกสาร
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* High-Impact Legal & Operational Guardrails Summary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm md:text-base font-bold text-[#1B365D] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>สรุปจุดตัดอำนาจหน้าที่และเพดานตัวเลขบังคับสำคัญที่ต้องตรวจสอบก่อนตัดสินใจ (Key Legal Guardrails)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200">
                  <div className="font-bold text-amber-900 mb-1">1. การแยก 2 บัญชี &amp; วงเงินมอบอำนาจ พด.70/2564</div>
                  <p className="text-slate-700 leading-relaxed">
                    แยก <strong>เงินสำนักงาน (ม.45)</strong> ออกจาก <strong>เงินกองทุน ววน. (ม.55)</strong> อย่างเด็ดขาด โดยวงเงินไม่เกิน <strong>500,000 บาท</strong>: งบสำนักงานอนุมัติโดย <strong>ผอ.สำนัก F5</strong> ส่วนงบกองทุนอนุมัติโดย <strong>ผอ.สำนัก F2</strong> (และเจ้าหน้าที่พัสดุไม่เกิน 10,000 บาท ตาม พด.71/2564)
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-teal-50/70 border border-teal-200">
                  <div className="font-bold text-teal-900 mb-1">2. วงจรคำของบ (SOP) &amp; การคืนเงิน PMU ใน 45 วัน</div>
                  <p className="text-slate-700 leading-relaxed">
                    เปิดรับคำขอ FF/SF <strong>45 วัน</strong> → กลั่นกรอง <strong>20 วัน</strong> → แก้ไข <strong>20 วัน</strong> → ปรับ Pre-ceiling <strong>15+10 วัน</strong> ออกเป็น <strong>คำรับรอง ม.18</strong> (ผูกพันข้ามปี 50:50) และ PMU ต้องส่งคืนเงินเหลือจ่ายพร้อมดอกเบี้ยภายใน <strong>45 วัน</strong>
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200">
                  <div className="font-bold text-indigo-900 mb-1">3. ปิดบัญชี 90/180 วัน · โทษอาญา ม.36 · สัญญา สกว.</div>
                  <p className="text-slate-700 leading-relaxed">
                    ส่งงบสำนักงานต่อผู้สอบบัญชีใน <strong>90 วัน (ม.39)</strong> vs ส่งงบกองทุนต่อ สตง. ใน <strong>180 วัน (ม.61)</strong> · เปิดเผยความลับฐานข้อมูล NRIIS มีโทษอาญา <strong>จำคุกไม่เกิน 5 ปี / ปรับไม่เกิน 100,000 บาท (ม.36)</strong> · ทวงหนี้ สกว. เตือน 30 วัน / บอกเลิก 15 วัน / ฟ้องก่อนขาดอายุความ 6 เดือน
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: SMART LEGAL REPOSITORY (101 DOCS & 119 STATUTORY SECTIONS) */}
        {/* ================================================================= */}
        {activeTab === 'repository' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRepoSubView('files')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                      repoSubView === 'files'
                        ? 'bg-[#1B365D] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ทะเบียนเอกสารครบ 12 หมวด ({filteredDocs.length} / 104 รหัส)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepoSubView('sections')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                      repoSubView === 'sections'
                        ? 'bg-[#0D5C63] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    สืบค้นตัวบทกฎหมายแม่บทรายมาตรา ({filteredSections.length} มาตรา)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepoSubView('chains24')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                      repoSubView === 'chains24'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    สายโซ่เชื่อมโยงกฎหมาย 3 ระดับ (24 สายโซ่ · ส่งมอบชิ้นที่ 1 &amp; 4)
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
                  >
                    <option value="ALL">ทุกหมวด (หมวดที่ 1–12)</option>
                    {DB.categories11.map((c, i) => (
                      <option key={c.cat_no} value={String(i + 1)}>
                        {c.cat_no}: {c.cat_name} ({c.active_count} ไฟล์)
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCluster}
                    onChange={(e) => setSelectedCluster(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
                  >
                    <option value="ALL">ทุกคลัสเตอร์ (A1–A5, B1–B4)</option>
                    {['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4'].map((cl) => (
                      <option key={cl} value={cl}>
                        Cluster {cl}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedTorLevel}
                    onChange={(e) => setSelectedTorLevel(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
                  >
                    <option value="ALL">ทุกระดับตามกรอบ TOR 4.1.1</option>
                    <option value="ระดับที่ 1">ระดับที่ 1: กฎหมายจัดตั้ง</option>
                    <option value="ระดับที่ 2">ระดับที่ 2: กฎรอง / คู่มือ / SOP</option>
                    <option value="ระดับที่ 3">ระดับที่ 3: กฎหมายที่เกี่ยวข้อง &amp; ม.77</option>
                  </select>

                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyActiveFiles}
                      onChange={(e) => setOnlyActiveFiles(e.target.checked)}
                      className="rounded"
                    />
                    <span>เฉพาะ 103 ไฟล์ใช้งานจริง</span>
                  </label>

                  {(selectedCat !== 'ALL' || selectedCluster !== 'ALL' || selectedTorLevel !== 'ALL' || onlyActiveFiles || globalSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCat('ALL');
                        setSelectedCluster('ALL');
                        setSelectedTorLevel('ALL');
                        setOnlyActiveFiles(false);
                        setGlobalSearch('');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold"
                    >
                      ล้างตัวกรอง
                    </button>
                  )}
                </div>
              </div>

              {repoSubView === 'files' ? (
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1B365D] text-white">
                        <th className="py-2.5 px-3">รหัสทะเบียน</th>
                        <th className="py-2.5 px-3">หมวด / ระดับ TOR</th>
                        <th className="py-2.5 px-3">ชื่อเอกสารและสาระสำคัญ (Key Provisions)</th>
                        <th className="py-2.5 px-3">ฐานอำนาจเชื่อมโยง</th>
                        <th className="py-2.5 px-3 text-center">Clusters</th>
                        <th className="py-2.5 px-3 text-center">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredDocs.map((doc) => (
                        <tr
                          key={doc.tsri_f}
                          className={doc.is_active ? 'hover:bg-blue-50/40' : 'bg-rose-50/60 text-slate-500'}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-[#1B365D] whitespace-nowrap">
                            <div>{doc.tsri_f}</div>
                            <div className="text-[11px] text-slate-500">{doc.doc_id}</div>
                            <span
                              className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                doc.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-200 text-rose-900'
                              }`}
                            >
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-800">{doc.cat_label}</div>
                            <div className="text-[11px] text-teal-800 font-medium mt-0.5">{doc.tor_level}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{doc.owner_bureau}</div>
                          </td>
                          <td className="py-2.5 px-3 max-w-md">
                            <div className="font-bold text-slate-900">{doc.formal_title}</div>
                            <div className="text-slate-600 mt-1 line-clamp-2">{doc.key_provisions}</div>
                          </td>
                          <td className="py-2.5 px-3 max-w-xs text-slate-700">{doc.legal_basis}</td>
                          <td className="py-2.5 px-3 text-center font-semibold text-[#0D5C63]">{doc.clusters}</td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <div className="flex flex-col gap-1.5 items-center">
                              <button
                                type="button"
                                onClick={() => setInspectDoc(doc)}
                                className="w-full px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>ดูรายละเอียด</span>
                              </button>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-[11px] flex items-center justify-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>เปิดไฟล์ Drive</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : repoSubView === 'chains24' ? (
                <div className="space-y-4 mt-3">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800">
                    <div className="font-bold text-amber-950 mb-1">
                      ตารางแสดงแหล่งที่มาและความเชื่อมโยงของกฎหมายแต่ละระดับ (Multi-Level Legal Linkage: ระดับที่ 1 ↔ ระดับที่ 2 ↔ ระดับที่ 3) — ส่งมอบงานชิ้นที่ (1) และชิ้นที่ (4) รุ่น V6
                    </div>
                    <p>
                      แสดงสายโซ่ความเชื่อมโยงครบทั้ง 24 สายโซ่หลัก (ชุดแผนและงบประมาณ 8 สาย · ชุดการใช้ประโยชน์ผลงานวิจัย TRIUP 8 สาย · ชุดการบริหารภายใน คู่มือ ม.77 และหมวด 12 กฎหมายงบประมาณ/การคลัง/พัสดุ 8 สาย)
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#1B365D] text-white">
                          <th className="py-2.5 px-3">รหัสสายโซ่</th>
                          <th className="py-2.5 px-3">ชุดการเชื่อมโยง / ชื่อสายโซ่</th>
                          <th className="py-2.5 px-3">ระดับที่ 1: กฎหมายแม่บท/จัดตั้ง (4.1.1.1)</th>
                          <th className="py-2.5 px-3">ระดับที่ 2: กฎรอง / คู่มือ 4 เล่ม / SOP (4.1.1.2)</th>
                          <th className="py-2.5 px-3">ระดับที่ 3: กฎหมายที่เกี่ยวข้อง &amp; หมวด 12 (4.1.1.3)</th>
                          <th className="py-2.5 px-3">กลไกปฏิบัติงาน &amp; เจ้าภาพ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(DB.chains24 || []).map((ch) => (
                          <tr key={ch.chain_id} className="hover:bg-blue-50/40">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#1B365D] whitespace-nowrap">{ch.chain_id}</td>
                            <td className="py-2.5 px-3">
                              <div className="text-[11px] font-semibold text-teal-800">{ch.group_name}</div>
                              <div className="font-bold text-slate-900 mt-0.5">{ch.title}</div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-700">{ch.level1}</td>
                            <td className="py-2.5 px-3 text-slate-700">{ch.level2}</td>
                            <td className="py-2.5 px-3 text-slate-700">{ch.level3}</td>
                            <td className="py-2.5 px-3 text-slate-700">
                              <div>{ch.mechanism}</div>
                              <div className="text-[11px] font-semibold text-[#0D5C63] mt-1">{ch.cluster_owner}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0D5C63] text-white">
                        <th className="py-2.5 px-3">กฎหมายแม่บท</th>
                        <th className="py-2.5 px-3">มาตรา</th>
                        <th className="py-2.5 px-3">Cluster ที่เกี่ยวข้อง</th>
                        <th className="py-2.5 px-3">สาระสำคัญของบทบัญญัติเพื่อการสืบค้นและอ้างอิง</th>
                        <th className="py-2.5 px-3 text-center">ต้นฉบับ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredSections.map((sec) => (
                        <tr key={sec.id} className="hover:bg-teal-50/40">
                          <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                            <div>{sec.act_name}</div>
                            <div className="text-[11px] font-mono text-slate-500">{sec.doc_code}</div>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#1B365D] whitespace-nowrap">
                            {sec.section}
                            <div className="text-[10px] text-slate-500">หน้า {sec.page}</div>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-teal-800">{sec.cluster}</td>
                          <td className="py-2.5 px-3 text-slate-700 leading-relaxed">{sec.text}</td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <a
                              href={sec.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-semibold"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>เปิดราชกิจจาฯ</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: 9 CLUSTERS & CROSS-LIST 15 MATRIX                          */}
        {/* ================================================================= */}
        {activeTab === 'clusters' && (
          <div className="space-y-6">
            {/* 9 Cluster Filter Pills */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h2 className="text-base font-bold text-[#1B365D]">
                  แผนผังการเชื่อมโยง 9 คลัสเตอร์ (112 ภารกิจ · 159 คู่เชื่อมเอกสาร) และตาราง Cross-List ทั้ง 15 ข้อ (CL-01 ถึง CL-15)
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveClusterFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      activeClusterFilter === 'ALL' ? 'bg-[#1B365D] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    แสดงทุกคลัสเตอร์ (15 ข้อ)
                  </button>
                  {DB.clusters9.map((c) => (
                    <button
                      key={c.cluster}
                      type="button"
                      onClick={() => setActiveClusterFilter(c.cluster)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        activeClusterFilter === c.cluster
                          ? 'bg-[#0D5C63] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {c.cluster} ({c.doc_links} คู่เชื่อม)
                    </button>
                  ))}
                </div>
              </div>

              {/* Cross-List 15 Cards */}
              <div className="space-y-4">
                {filteredCrossList.map((cl) => (
                  <div
                    key={cl.cl_code}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition p-4 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-3 border-b border-slate-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#1B365D] text-white font-mono font-bold text-xs">
                          {cl.cl_code}
                        </span>
                        <span className="font-bold text-sm md:text-base text-slate-900">{cl.cluster}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold">
                          {cl.owner}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                          {cl.status}
                        </span>
                        <a
                          href={cl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                        >
                          <span>เปิดเอกสารอ้างอิง</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3 text-xs">
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-[#1B365D] mb-1">
                          ระยะที่ 1–2: ฐานกฎหมาย 3 ระดับ &amp; คลัง 100 ไฟล์
                        </div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{cl.phase1_2_legal}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-[#0D5C63] mb-1">
                          ระยะที่ 3: เกณฑ์ประเมิน C1 / C2 / A &amp; เครื่องมือภาคสนาม
                        </div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{cl.phase3_c1_c2_a}</p>
                        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                          {cl.phase3_tools}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-amber-800 mb-1">
                            ระยะที่ 4: สื่อการเรียนรู้ 15 คลิป &amp; ข้อสอบ 30:70
                          </div>
                          <p className="text-slate-700 leading-relaxed">{cl.phase4_media_exam}</p>
                        </div>

                        {/* Interactive Researcher Note Box */}
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          {editingNoteCode === cl.cl_code ? (
                            <div className="space-y-2">
                              <textarea
                                rows={2}
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                placeholder="เพิ่มบันทึกการตรวจแฟ้มหรือข้อสังเกต..."
                                className="w-full p-2 rounded border border-slate-300 text-xs"
                              />
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveNote(cl.cl_code)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold"
                                >
                                  บันทึก
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteCode(null)}
                                  className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-semibold"
                                >
                                  ยกเลิก
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-600 italic">
                                {customNotes[cl.cl_code]
                                  ? `หมายเหตุนักวิจัย: ${customNotes[cl.cl_code]}`
                                  : 'ยังไม่มีบันทึกเพิ่มเติม'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteCode(cl.cl_code);
                                  setNoteDraft(customNotes[cl.cl_code] || '');
                                }}
                                className="text-[11px] font-semibold text-blue-700 hover:underline"
                              >
                                + เพิ่ม/แก้ไขบันทึก
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: AI LEGAL RAG & DECISION SUPPORT ASSISTANT                  */}
        {/* ================================================================= */}
        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Preset Legal Scenarios Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1B365D]">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>หัวข้อวินิจฉัยข้อกฎหมายสำคัญ (คลิกเพื่อถาม AI)</span>
              </div>
              <p className="text-xs text-slate-500">
                ระบบ AI จะปรับน้ำหนักคำตอบตามมุมมองปัจจุบันของท่าน ({currentRoleObj.short}) พร้อมชี้รหัสเอกสารในคลัง 100 ไฟล์
              </p>
              <div className="space-y-2">
                {DB.aiKnowledgeBase.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleAskAi(card.title)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-[#1B365D] hover:bg-blue-50/40 transition text-xs group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-teal-800 mb-0.5">
                      <span>Cluster {card.cluster}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1B365D]" />
                    </div>
                    <div className="font-bold text-slate-800 group-hover:text-[#1B365D]">{card.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive AI Chat & Decision Output Area */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[680px]">
              <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex items-center justify-between">
                <div>
                  <h2 className="text-sm md:text-base font-bold text-[#1B365D] flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-teal-700" />
                    <span>TSRI Legal RAG Assistant · ระบบผู้ช่วยวิเคราะห์ฐานอำนาจและแนวปฏิบัติ</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    กำลังทำงานในโหมด: <strong>{currentRoleObj.name}</strong> (สัดส่วน {currentRoleObj.ratio})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiMessages([aiMessages[0]])}
                  className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ล้างประวัติ</span>
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiMessages.map((msg, idx) =>
                  msg.role === 'user' ? (
                    <div key={idx} className="flex justify-end">
                      <div className="bg-[#1B365D] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xl text-xs md:text-sm font-medium shadow">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm p-4 space-y-3 shadow-sm text-xs"
                    >
                      <div className="font-bold text-sm text-[#1B365D] flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{msg.title}</span>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-slate-900 mb-1">
                          1. ฐานอำนาจตามกฎหมายแม่บท (Statutory Basis):
                        </div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{msg.statutory_basis}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-[#0D5C63] mb-1">
                          2. กฎรอง คู่มือ และเกณฑ์ปฏิบัติการจริง (Operational Rules &amp; SOP):
                        </div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{msg.operational_rule}</p>
                      </div>

                      {msg.checklist && (
                        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
                          <div className="font-bold text-amber-950 mb-1.5">
                            3. รายการตรวจสอบก่อนตัดสินใจ/ปฏิบัติงาน (Decision &amp; Compliance Checklist):
                          </div>
                          <ul className="space-y-1 text-slate-800 list-disc list-inside">
                            {msg.checklist.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.docs && msg.docs.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-500">เอกสารอ้างอิงในคลัง:</span>
                          {msg.docs.map((code) => {
                            const d = docLookupMap[code];
                            return (
                              <button
                                key={code}
                                type="button"
                                onClick={() => d && setInspectDoc(d)}
                                className="px-2 py-1 rounded bg-white hover:bg-blue-50 text-blue-800 border border-slate-300 font-mono font-semibold text-[11px]"
                              >
                                {code}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi();
                }}
                className="p-3 border-t border-slate-200 bg-white rounded-b-xl flex gap-2"
              >
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="พิมพ์คำถามข้อกฎหมาย อำนาจอนุมัติ หรือขั้นตอนปฏิบัติงาน (เช่น วงเงิน 500,000 บาท ใครอนุมัติ)..."
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1B365D] hover:bg-blue-900 text-white font-semibold text-xs md:text-sm flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>วิเคราะห์คำตอบ</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: PHASE 3 FIELDWORK TOOLKIT (N=80, C1/C2/A, 32 QUESTIONS)    */}
        {/* ================================================================= */}
        {activeTab === 'phase3' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'questions', label: '1. แบบสัมภาษณ์ & ประเมิน C1/C2/A (32 ข้อ)' },
                    { id: 'sampling', label: '2. แผนกลุ่มตัวอย่าง 80 คน (ครบ P01–P27)' },
                    { id: 'fgd', label: '3. สนทนากลุ่ม 6 FGD & Workshop 2 เวที' },
                    { id: 'chains', label: '4. ห่วงโซ่ตรวจแฟ้มจริง 6 สายงาน (ACT-003)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFieldSubView(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        fieldSubView === t.id
                          ? 'bg-[#1B365D] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {fieldSubView === 'questions' && (
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { id: 'ALL', label: 'ทั้งหมด (32 ข้อ)' },
                      { id: 'CORE', label: 'Check & Balance (Q01–Q12)' },
                      { id: 'EXEC', label: 'ผู้บริหาร (QH01–QH10)' },
                      { id: 'OPER', label: 'ปฏิบัติการ/Walkthrough (QO01–QO10)' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setQuestionGroupFilter(g.id)}
                        className={`px-2.5 py-1 rounded border font-semibold ${
                          questionGroupFilter === g.id
                            ? 'bg-teal-800 text-white border-teal-800'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-view 1: 32 Interview Questions with Interactive C1/C2/A Scoring */}
              {fieldSubView === 'questions' && (
                <div className="space-y-3 mt-4">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-700 flex items-center justify-between">
                    <span>
                      <strong>กฎเหล็กการวินิจฉัยช่องว่างระยะที่ 3:</strong> แยกแยะ <strong>Evidence Gap</strong> (กรณีอยู่ระหว่างรอแฟ้มเอกสารหลักฐาน) ออกจาก <strong>Compliance Gap</strong> (กรณีมีหลักฐานยืนยันว่าปฏิบัติไม่ตรงตามฐานอำนาจหรือเงื่อนไขตามกฎหมาย)
                    </span>
                  </div>
                  {filteredQuestions.map((q) => {
                    const currentScore = c1c2aRatings[q.q_code] || {
                      C1: 'ครบถ้วน (Pass)',
                      C2: 'สอดคล้อง (Compliant)',
                      A: 'เหมาะสม (Appropriate)',
                    };
                    return (
                      <div key={q.q_code} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-[#1B365D] text-white font-mono font-bold text-xs">
                              {q.q_code}
                            </span>
                            <span className="text-xs font-bold text-teal-800">{q.instrument_group}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              เป้าหมาย: {q.target_role}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
                              มิติ: {q.dim_d1_d5}
                            </span>
                          </div>
                        </div>

                        <div className="font-bold text-xs md:text-sm text-slate-900 mt-2.5">{q.question_text}</div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-800 mb-1">จุดปลั๊กอินกฎหมาย &amp; เอกสารอ้างอิง:</div>
                            <div className="text-slate-600">{q.legal_plugin}</div>
                          </div>
                          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                            <div className="font-bold text-teal-900 mb-1">เกณฑ์ประเมิน C1 / C2 / A:</div>
                            <div className="text-slate-600 whitespace-pre-line">{q.c1_c2_a_rubric}</div>
                          </div>
                          <div className="p-2.5 rounded bg-amber-50/50 border border-amber-200">
                            <div className="font-bold text-amber-900 mb-1">การจำแนกช่องว่าง &amp; บันทึกผลสนาม:</div>
                            <div className="text-slate-700 mb-2">{q.gap_Rule}</div>
                            <div className="flex flex-wrap gap-1.5">
                              {['C1', 'C2', 'A'].map((dim) => (
                                <select
                                  key={dim}
                                  value={currentScore[dim]}
                                  onChange={(e) => handleSetRating(q.q_code, dim, e.target.value)}
                                  className="px-2 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold"
                                >
                                  <option value="ครบถ้วน/สอดคล้อง (Pass)">{dim}: ผ่านเกณฑ์ (Pass)</option>
                                  <option value="รอหลักฐาน (Evidence Gap)">{dim}: รอแฟ้ม (Evidence Gap)</option>
                                  <option value="พบช่องว่าง (Gap Found)">{dim}: พบช่องว่าง (Gap)</option>
                                </select>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-view 2: Sampling Plan N=80 */}
              {fieldSubView === 'sampling' && (
                <div className="space-y-4 mt-4">
                  <h3 className="text-sm font-bold text-[#1B365D]">
                    สรุปโครงสร้างกลุ่มตัวอย่างผู้ให้ข้อมูลสำคัญ N = 80 คน (ไม่นับซ้ำ) ตามเอกสาร GUIDE-WS03-001-2569
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#1B365D] text-white">
                          <th className="py-2 px-3">รหัสกลุ่ม (TOR)</th>
                          <th className="py-2 px-3">กลุ่มผู้ให้ข้อมูลสำคัญ</th>
                          <th className="py-2 px-3 text-center">จำนวนคน</th>
                          <th className="py-2 px-3">องค์ประกอบและตำแหน่ง</th>
                          <th className="py-2 px-3">เครื่องมือที่ใช้ &amp; สัดส่วนความรู้</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {DB.sampling80.map((grp) => (
                          <tr key={grp.group_code} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-[#1B365D]">
                              {grp.group_code}
                              <div className="text-[11px] font-mono text-slate-500">{grp.slot_range}</div>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">{grp.group_name}</td>
                            <td className="py-2.5 px-3 text-center font-extrabold text-emerald-700">
                              {grp.unique_count} คน
                            </td>
                            <td className="py-2.5 px-3 whitespace-pre-line text-slate-700">{grp.composition}</td>
                            <td className="py-2.5 px-3 text-slate-700">
                              <div className="font-semibold text-teal-900">{grp.instrument_code}</div>
                              <div className="mt-1">{grp.focus_c1_c2_a}</div>
                              <div className="mt-1 font-bold text-amber-800">{grp.knowledge_ratio}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-sm font-bold text-[#0D5C63] pt-2">
                    การกระจายตัวตามโครงสร้างส่วนงาน สกสว. พ.ศ. 2569 (5 สำนัก 24 ฝ่าย · 6 หน่วยภารกิจ IU1–IU6 · 1 IA = 31 หน่วยงานย่อย)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0D5C63] text-white">
                          <th className="py-2 px-3">ส่วนงาน</th>
                          <th className="py-2 px-3">รหัส Slot &amp; จำนวนคน</th>
                          <th className="py-2 px-3">รายชื่อฝ่าย / หน่วยย่อย (31 หน่วย)</th>
                          <th className="py-2 px-3">กระบวนงาน (P01–P27)</th>
                          <th className="py-2 px-3">เอกสารหลัก (TSRI-F)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {DB.bureauMap27.map((b) => (
                          <tr key={b.unit_code} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {b.unit_code}
                              <div className="text-[11px] font-normal text-slate-600">{b.unit_name}</div>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-[#1B365D] whitespace-nowrap">{b.slots}</td>
                            <td className="py-2.5 px-3 text-slate-700">{b.divisions}</td>
                            <td className="py-2.5 px-3 text-teal-900 font-medium">{b.processes}</td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{b.key_docs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-view 3: 6 FGDs & 2 Validation Workshops */}
              {fieldSubView === 'fgd' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {DB.fgdAndWorkshops.map((fgd) => (
                    <div key={fgd.fgd_code} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#1B365D] text-white font-mono font-bold text-xs">
                          {fgd.fgd_code}
                        </span>
                        <span className="text-xs font-semibold text-teal-800">
                          Clusters: {fgd.clusters} | {fgd.processes}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-slate-900 mb-1">{fgd.title}</div>
                      <div className="text-xs text-slate-600 mb-2">
                        <strong>ผู้เข้าร่วม:</strong> {fgd.participants} ({fgd.duration})
                      </div>
                      <div className="p-2.5 rounded bg-white border border-slate-200 text-xs text-slate-700 whitespace-pre-line mb-2">
                        {fgd.key_issues}
                      </div>
                      <div className="text-xs text-emerald-800 font-medium">
                        <strong>ผลลัพธ์:</strong> {fgd.expected_outputs}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-view 4: 6 Fieldwork Chains (ACT-003) */}
              {fieldSubView === 'chains' && (
                <div className="space-y-3 mt-4">
                  {DB.fieldworkChains6.map((ch) => (
                    <div key={ch.chain_code} className="p-4 rounded-xl border border-slate-200 bg-white">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#0D5C63] text-white font-mono font-bold text-xs">
                          {ch.chain_code}
                        </span>
                        <span className="font-bold text-sm text-slate-900 flex-1">{ch.chain_name}</span>
                        <span className="text-xs font-semibold text-slate-600">{ch.bureaus}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-2">
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <div className="font-bold text-[#1B365D] mb-1">ฐานกฎหมายแม่บท (D1):</div>
                          <div>{ch.statutory_basis}</div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <div className="font-bold text-teal-900 mb-1">กฎรอง คู่มือ และ SOP (D2):</div>
                          <div>{ch.operational_rules}</div>
                        </div>
                        <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200">
                          <div className="font-bold text-emerald-950 mb-1">หลักฐานในแฟ้มจริงที่ต้องตรวจ (D5):</div>
                          <div className="whitespace-pre-line">{ch.empirical_evidence}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: PHASE 4 LEARNING HUB (15 CLIPS & 30:70 EXAM SIMULATOR)     */}
        {/* ================================================================= */}
        {activeTab === 'phase4' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'clips', label: '1. โครงสร้างสื่อวิดีโอ 15 คลิป (6 ยาว + 9 สั้น)' },
                    { id: 'exam', label: '2. ระบบจำลองสอบวัดสมรรถนะ 30:70 (15 ข้อมาตรฐาน)' },
                    { id: 'playbooks', label: '3. คัมภีร์กฎหมาย 2 ฉบับ & อินโฟกราฟิก 8 ชิ้น' },
                    { id: 'sets', label: '4. บลูปริ้นท์แบบทดสอบ 12 ชุดตาม TOR' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setLearnSubView(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        learnSubView === t.id
                          ? 'bg-[#1B365D] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-view 1: 15 Video Clips */}
              {learnSubView === 'clips' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {DB.clips15.map((clip) => (
                    <div
                      key={clip.clip_code}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white p-4 flex flex-col justify-between shadow-sm transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-[#1B365D] text-white font-mono font-bold text-xs">
                            {clip.clip_code}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              clip.format_duration.includes('คลิปยาว')
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-teal-100 text-teal-900'
                            }`}
                          >
                            {clip.format_duration}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">
                          {clip.cluster} · เป้าหมาย: <strong className="text-slate-800">{clip.target_role} ({clip.ratio})</strong>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mb-2">{clip.title}</h4>
                        <p className="text-xs text-slate-600 mb-3">{clip.learning_objective}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-500">คู่ข้อสอบ: {clip.exam_link}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedClip(clip)}
                          className="px-2.5 py-1 rounded bg-[#0D5C63] hover:bg-teal-900 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>ดู Storyboard</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-view 2: Interactive 30:70 Scenario Exam Simulator */}
              {learnSubView === 'exam' && (
                <div className="space-y-4 mt-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#1B365D] text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>ระบบจำลองการสอบวัดสมรรถนะเชิงสถานการณ์ (Scenario-Based Competency Exam 30:70)</span>
                      </h3>
                      <p className="text-xs text-slate-200 mt-0.5">
                        วัดความเข้าใจฐานอำนาจตามกฎหมายแม่บท 30% และความแม่นยำในการใช้กฎรอง คู่มือ และ SOP 70%
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={examRoleFilter}
                        onChange={(e) => setExamRoleFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/25 text-xs text-white font-semibold"
                      >
                        <option value="ALL" className="text-slate-900">ทุกกลุ่มเป้าหมาย (15 ข้อ)</option>
                        <option value="BOARD_TOP" className="text-slate-900">บอร์ด &amp; ผู้บริหารระดับสูง (80:20 / 60:40)</option>
                        <option value="MID" className="text-slate-900">ผู้บริหารระดับกลาง (45:55)</option>
                        <option value="OPER" className="text-slate-900">หัวหน้าฝ่าย &amp; ผู้ปฏิบัติงาน (30:70)</option>
                      </select>
                      <div className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-xs">
                        คะแนน: {examScoreSummary.correct} / {examScoreSummary.total} ({examScoreSummary.pct}%)
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setExamSubmitted(true);
                          showToast(`ตรวจคำตอบเรียบร้อย: ได้ ${examScoreSummary.correct}/${examScoreSummary.total} คะแนน (${examScoreSummary.pct}%)`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                      >
                        ตรวจคำตอบ &amp; ดูเฉลย 30:70
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExamAnswers({});
                          setExamSubmitted(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold"
                      >
                        เริ่มใหม่
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredExams.map((item) => {
                      const picked = examAnswers[item.item_id];
                      const optionLines = item.options.split('\n');
                      return (
                        <div key={item.item_id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded bg-[#1B365D] text-white font-mono font-bold text-xs">
                              {item.item_id} · {item.cluster_clip}
                            </span>
                            <span className="text-xs font-semibold text-teal-800">กลุ่มเป้าหมาย: {item.target_role}</span>
                          </div>
                          <div className="font-bold text-xs md:text-sm text-slate-900 mb-3 leading-relaxed">
                            {item.scenario_stem}
                          </div>
                          <div className="space-y-2">
                            {optionLines.map((line) => {
                              const letter = line.trim().charAt(0);
                              const isPicked = picked === letter;
                              const isRight = item.correct_answer === letter;
                              let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-blue-50/50 text-slate-800';
                              if (examSubmitted) {
                                if (isRight) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                                else if (isPicked && !isRight) btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                              } else if (isPicked) {
                                btnStyle = 'border-[#1B365D] bg-blue-50 text-[#1B365D] font-bold ring-1 ring-[#1B365D]';
                              }
                              return (
                                <button
                                  key={letter}
                                  type="button"
                                  onClick={() => setExamAnswers((prev) => ({ ...prev, [item.item_id]: letter }))}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-start justify-between gap-2 ${btnStyle}`}
                                >
                                  <span>{line}</span>
                                  {examSubmitted && isRight && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {(examSubmitted || picked) && (
                            <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                              <div className="font-bold text-emerald-800 mb-1">
                                เฉลยที่ถูกต้อง: ข้อ {item.correct_answer} | คำอธิบายแยกสัดส่วน 30:70
                              </div>
                              <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                                {item.rationale_30_70}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-view 3: 2 Playbooks & 8 Infographics */}
              {learnSubView === 'playbooks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {DB.playbooksAndInfographics.map((m) => (
                    <div key={m.media_code} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2.5 py-0.5 rounded bg-[#0D5C63] text-white font-mono font-bold text-xs">
                          {m.media_code}
                        </span>
                        <span className="text-xs font-semibold text-amber-800">{m.media_type}</span>
                      </div>
                      <div className="font-bold text-sm text-slate-900 mb-1">{m.scope_clusters}</div>
                      <div className="text-xs text-slate-600 mb-2">
                        <strong>กลุ่มเป้าหมาย:</strong> {m.target_audience}
                      </div>
                      <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                        {m.core_content}
                      </p>
                      <div className="mt-2 text-[11px] font-mono text-slate-500">อ้างอิง: {m.linked_docs}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-view 4: 12 Exam Sets Blueprint */}
              {learnSubView === 'sets' && (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1B365D] text-white">
                        <th className="py-2.5 px-3">รหัสชุดข้อสอบ</th>
                        <th className="py-2.5 px-3">ชื่อชุดแบบทดสอบวัดสมรรถนะ (12 ชุดตาม TOR ข้อ 8.1.3)</th>
                        <th className="py-2.5 px-3">กลุ่มเป้าหมาย</th>
                        <th className="py-2.5 px-3">สัดส่วนคะแนน</th>
                        <th className="py-2.5 px-3">โครงสร้างและเกณฑ์ผ่าน</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {DB.examSets12.map((s) => (
                        <tr key={s.set_code} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#1B365D]">{s.set_code}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{s.set_name}</td>
                          <td className="py-2.5 px-3 text-slate-700">{s.target_tier}</td>
                          <td className="py-2.5 px-3 font-semibold text-teal-800">{s.weight_ratio}</td>
                          <td className="py-2.5 px-3 text-slate-700">
                            <div>{s.item_composition}</div>
                            <div className="text-emerald-800 font-semibold mt-0.5">เกณฑ์ผ่าน: {s.passing_criteria}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: ANTIGRAVITY IDE & CLOUDFLARE PAGES/WORKERS ARCHITECTURE    */}
        {/* ================================================================= */}
        {activeTab === 'dev' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-[#1B365D] flex items-center gap-2">
                    <Cloud className="w-6 h-6 text-amber-500" />
                    <span>สถาปัตยกรรม Full-Stack สำหรับพัฒนาต่อบน Antigravity IDE และ Deploy ขึ้น Cloudflare Pages / Workers</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    ชุดโค้ดต้นฉบับทั้งหมดถูกจัดเตรียมไว้ในไฟล์ซิป <strong>tsri-legal-km-cloudflare-antigravity-v6.zip</strong> พร้อมฐานข้อมูล SQL (D1) และ API ของ Workers AI
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-sm text-[#1B365D] flex items-center gap-1.5 mb-2">
                    <FolderGit2 className="w-4 h-4 text-blue-700" />
                    <span>1. Frontend Stack (React 18 + Vite + TS)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                    <li><strong>Framework:</strong> React 18.3 + Vite 5 + TypeScript</li>
                    <li><strong>Styling &amp; UI:</strong> Tailwind CSS + Lucide Icons + Recharts</li>
                    <li><strong>Role-Based State:</strong> 5 Role Lenses (80:20, 60:40, 45:55, 30:70)</li>
                    <li><strong>Offline-First Hybrid Client:</strong> เรียกใช้ Cloudflare Worker API และมี Fallback Dataset ในตัว</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-sm text-[#0D5C63] flex items-center gap-1.5 mb-2">
                    <Database className="w-4 h-4 text-teal-700" />
                    <span>2. Cloudflare Pages Functions &amp; D1 SQL</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                    <li><strong>Edge API:</strong> Hono / Cloudflare Pages Functions (<code>functions/api/[[route]].ts</code>)</li>
                    <li><strong>Database:</strong> Cloudflare D1 Serverless SQLite (<code>db/schema.sql</code> &amp; <code>db/seed.sql</code>)</li>
                    <li><strong>Seeded Records:</strong> ครบ 104 รหัสเอกสาร (12 หมวด · 103 ไฟล์ใช้งานจริง), 24 สายโซ่เชื่อมโยง 3 ระดับ, 9 Clusters, 15 Cross-List, 32 คำถาม, 15 คลิป, 15 ข้อสอบ</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-sm text-amber-800 flex items-center gap-1.5 mb-2">
                    <Cpu className="w-4 h-4 text-amber-600" />
                    <span>3. Cloudflare Workers AI &amp; Vectorize RAG</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                    <li><strong>Embeddings:</strong> <code>@cf/baai/bge-m3</code> (รองรับภาษาไทยและมาตรากฎหมายแม่นยำสูง)</li>
                    <li><strong>LLM Inference:</strong> <code>@cf/meta/llama-3.1-8b-instruct</code> พร้อม System Prompt กำกับสัดส่วน 80:20 ถึง 30:70</li>
                    <li><strong>Zero Cold-Start:</strong> รันบนเครือข่าย Edge ของ Cloudflare ทั่วโลก</li>
                  </ul>
                </div>
              </div>

              {/* CLI Commands with Copy Buttons */}
              <div className="mt-6 space-y-4">
                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                    <span className="text-amber-400 font-bold">
                      ขั้นตอนการเปิดโปรเจกต์ใน Antigravity IDE และ Deploy ขึ้น Cloudflare Pages / Workers
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          `unzip tsri-legal-km-cloudflare-antigravity-v6.zip -d tsri-legal-km\ncd tsri-legal-km\nnpm install\nnpx wrangler d1 create tsri_legal_km_db\nnpx wrangler d1 execute tsri_legal_km_db --local --file=./db/schema.sql\nnpx wrangler d1 execute tsri_legal_km_db --local --file=./db/seed.sql\nnpm run dev\nnpm run deploy`,
                          'คัดลอกคำสั่ง CLI ทั้งหมดแล้ว'
                        )
                      }
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-sans text-[11px] flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอกคำสั่ง</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto leading-relaxed text-emerald-300">{`# 1. แตกไฟล์ซิปและเปิดโฟลเดอร์โปรเจกต์ใน Antigravity IDE
unzip tsri-legal-km-cloudflare-antigravity-v6.zip -d tsri-legal-km
cd tsri-legal-km
npm install

# 2. สร้างฐานข้อมูล Cloudflare D1 และนำเข้าข้อมูลรุ่น V6 ครบ 104 รหัสเอกสาร (12 หมวด) + 24 สายโซ่ 3 ระดับ + Cross-List + ข้อสอบ 30:70
npx wrangler d1 create tsri_legal_km_db
npx wrangler d1 execute tsri_legal_km_db --local --file=./db/schema.sql
npx wrangler d1 execute tsri_legal_km_db --local --file=./db/seed.sql

# 3. รันทดสอบระบบแบบ Local (Vite + Cloudflare Pages Dev)
npm run dev

# 4. Deploy ขึ้น Cloudflare Pages / Workers บน Production
npx wrangler d1 execute tsri_legal_km_db --remote --file=./db/schema.sql
npx wrangler d1 execute tsri_legal_km_db --remote --file=./db/seed.sql
npm run deploy`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Document Details Drawer */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#1B365D] text-white font-mono font-bold text-xs">
                    {inspectDoc.tsri_f} ({inspectDoc.doc_id})
                  </span>
                  <span className="text-xs font-semibold text-teal-800">{inspectDoc.cat_label}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{inspectDoc.formal_title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">ระดับตามกรอบ TOR 4.1.1:</span>
                  <strong className="text-slate-900">{inspectDoc.tor_level}</strong>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Clusters &amp; สำนักเจ้าภาพ:</span>
                  <strong className="text-teal-900">
                    {inspectDoc.clusters} ({inspectDoc.owner_bureau})
                  </strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-[#1B365D] mb-1">ฐานอำนาจและกฎหมายที่เชื่อมโยง:</div>
                <p className="text-slate-700 leading-relaxed">{inspectDoc.legal_basis}</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                <div className="font-bold text-amber-950 mb-1">สาระสำคัญ เงื่อนไข และเพดานตัวเลขบังคับ:</div>
                <p className="text-slate-800 leading-relaxed">{inspectDoc.key_provisions}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>ชื่อไฟล์ในคลัง: {inspectDoc.file_name}</span>
                <span>จำนวนหน้า: {inspectDoc.pages} หน้า · SHA-256: {inspectDoc.sha256}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => copyText(`${inspectDoc.tsri_f}: ${inspectDoc.formal_title} (${inspectDoc.url})`)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกการอ้างอิง</span>
              </button>
              <a
                href={inspectDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-lg bg-[#1B365D] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดเอกสารต้นฉบับใน Google Drive</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Video Clip Storyboard Viewer */}
      {selectedClip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#0D5C63] text-white font-mono font-bold text-xs">
                    {selectedClip.clip_code}
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    กลุ่มเป้าหมาย: {selectedClip.target_role} (สัดส่วน {selectedClip.ratio})
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedClip.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClip(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-[#1B365D] mb-1">วัตถุประสงค์การเรียนรู้เชิงสมรรถนะ:</div>
                <p className="text-slate-700 leading-relaxed">{selectedClip.learning_objective}</p>
              </div>
              <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200">
                <div className="font-bold text-teal-950 mb-1">โครงสร้างบทและลำดับการเล่าเรื่อง (Storyboard):</div>
                <p className="text-slate-800 whitespace-pre-line leading-relaxed">{selectedClip.storyboard}</p>
              </div>
              <div className="text-[11px] font-mono text-slate-600">
                เอกสารอ้างอิง: {selectedClip.linked_docs} | ข้อสอบคู่ขนาน: {selectedClip.exam_link}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedClip(null);
                  setLearnSubView('exam');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#1B365D] text-white text-xs font-semibold"
              >
                ไปที่ข้อสอบคู่ขนาน ({selectedClip.exam_link})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
