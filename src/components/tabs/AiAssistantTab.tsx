import React from 'react';
import { ChevronRight, Cpu, RefreshCw, Scale, Sparkles } from 'lucide-react';
import { MASTER_BUNDLE as DB } from '../../data/tsriDatabase';
import { AiMessage, LegalDocument, RoleTier } from '../../types/portal';
import { SfBadge, SfButton, SfCard } from '../SoftFocusUI';

interface AiAssistantTabProps {
  currentRoleObj: RoleTier;
  aiQuery: string;
  setAiQuery: (v: string) => void;
  aiMessages: AiMessage[];
  onResetAi: () => void;
  onAskAi: (promptText?: string) => void;
  docLookupMap: Record<string, LegalDocument>;
  onInspectDoc: (doc: LegalDocument) => void;
}

export function AiAssistantTab({
  currentRoleObj,
  aiQuery,
  setAiQuery,
  aiMessages,
  onResetAi,
  onAskAi,
  docLookupMap,
  onInspectDoc,
}: AiAssistantTabProps) {
  return (
    <div className="space-y-4 sf-view-enter">
      {/* Mobile Quick Prompts Horizontal Slide Strip */}
      <div className="lg:hidden space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>เลื่อนเลือกโจทย์กฎหมายตัวอย่าง ({currentRoleObj.short})</span>
          </span>
        </div>
        <div className="sf-slide-track">
          {DB.aiKnowledgeBase.map((card) => (
            <button
              key={`mob-${card.id}`}
              type="button"
              onClick={() => onAskAi(card.title)}
              className="sf-slide-item sf-slide-item--compact sf-card !p-4 text-left border border-[var(--border)] flex flex-col justify-between gap-2 cursor-pointer"
            >
              <SfBadge tone="lilac">Cluster {card.cluster}</SfBadge>
              <div className="text-xs font-semibold line-clamp-2 leading-snug text-[var(--ink)]">
                {card.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar: Preset Legal Scenarios */}
        <SfCard className="hidden lg:block lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>หัวข้อวินิจฉัยสำคัญ</span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            AI จะปรับน้ำหนักคำตอบตามมุมมองปัจจุบัน ({currentRoleObj.short}) พร้อมชี้รหัสเอกสารในคลัง 100 ไฟล์
          </p>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {DB.aiKnowledgeBase.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onAskAi(card.title)}
                className="w-full text-left p-3.5 rounded-2xl bg-[var(--bg)] hover:bg-[var(--primary)] hover:text-[var(--on-primary)] transition text-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold opacity-75 mb-1">
                  <span>Cluster {card.cluster}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <div className="font-semibold leading-snug">{card.title}</div>
              </button>
            ))}
          </div>
        </SfCard>

        {/* Chat Area */}
        <SfCard className="lg:col-span-8 !p-0 overflow-hidden flex flex-col h-[72dvh] min-h-[520px] max-h-[720px] border border-[var(--border)]">
          {/* Chat Header */}
          <div className="p-4 md:p-5 bg-[var(--surface-soft)] border-b border-[var(--border)] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-semibold flex items-center gap-2 truncate">
                <Cpu className="w-5 h-5 shrink-0" />
                <span className="truncate">TSRI Legal RAG Assistant</span>
              </h2>
              <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                โหมด: <strong>{currentRoleObj.name}</strong> ({currentRoleObj.ratio})
              </p>
            </div>
            <SfButton
              variant="secondary"
              onClick={onResetAi}
              className="!min-h-[38px] !px-3.5 text-xs shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ล้างประวัติ</span>
            </SfButton>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-[var(--bg)]">
            {aiMessages.map((msg, idx) =>
              msg.role === 'user' ? (
                <div key={idx} className="flex justify-end">
                  <div className="px-4 py-3 rounded-3xl rounded-br-md bg-[var(--ink)] text-[var(--surface)] max-w-[85%] md:max-w-lg text-xs md:text-sm font-medium">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div
                  key={idx}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl rounded-tl-md p-4 md:p-5 space-y-3 text-xs"
                >
                  <div className="font-semibold text-sm md:text-base flex items-start gap-2">
                    <Scale className="w-4 h-4 shrink-0 mt-1" />
                    <span>{msg.title}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[var(--sky)] space-y-1">
                    <div className="font-semibold text-[var(--ink)]">
                      1. ฐานอำนาจตามกฎหมายแม่บท (Statutory Basis)
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-[var(--ink)] opacity-90">
                      {msg.statutory_basis}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[var(--mint)] space-y-1">
                    <div className="font-semibold text-[var(--ink)]">
                      2. กฎรอง คู่มือ และเกณฑ์ปฏิบัติการจริง (Operational Rules &amp; SOP)
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-[var(--ink)] opacity-90">
                      {msg.operational_rule}
                    </p>
                  </div>

                  {msg.checklist && (
                    <div className="p-3.5 rounded-2xl bg-[var(--primary)]/50 space-y-1.5">
                      <div className="font-semibold text-[var(--ink)]">
                        3. รายการตรวจสอบก่อนตัดสินใจ (Compliance Checklist)
                      </div>
                      <ul className="space-y-1 list-disc list-inside leading-relaxed text-[var(--ink)]">
                        {msg.checklist.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.docs && msg.docs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-[var(--muted)]">
                        เอกสารอ้างอิง:
                      </span>
                      {msg.docs.map((code) => {
                        const d = docLookupMap[code];
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => d && onInspectDoc(d)}
                            className="px-3 py-1 rounded-full bg-[var(--surface-soft)] hover:bg-[var(--primary)] text-[var(--ink)] font-mono font-semibold text-[11px] transition cursor-pointer"
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

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAskAi();
            }}
            className="p-3 md:p-4 border-t border-[var(--border)] bg-[var(--surface)] flex gap-2"
          >
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="พิมพ์คำถามข้อกฎหมาย อำนาจอนุมัติ หรือขั้นตอนปฏิบัติงาน..."
              className="sf-input flex-1 text-sm"
            />
            <SfButton type="submit" variant="primary" className="shrink-0">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">วิเคราะห์คำตอบ</span>
              <span className="sm:hidden">ส่ง</span>
            </SfButton>
          </form>
        </SfCard>
      </div>
    </div>
  );
}

