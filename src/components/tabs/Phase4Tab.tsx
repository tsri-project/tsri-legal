import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Play, Video } from 'lucide-react';
import { MASTER_BUNDLE as DB } from '../../data/tsriDatabase';
import { ExamItem, VideoClipItem } from '../../types/portal';
import {
  SfBadge,
  SfButton,
  SfCard,
  SfSegmented,
  SingleSlideNavigator,
  SlideDeck,
} from '../SoftFocusUI';

interface Phase4TabProps {
  learnSubView: 'clips' | 'exam' | 'playbooks' | 'sets';
  setLearnSubView: (v: 'clips' | 'exam' | 'playbooks' | 'sets') => void;
  onSelectClip: (clip: VideoClipItem) => void;
  examRoleFilter: string;
  setExamRoleFilter: (v: string) => void;
  filteredExams: ExamItem[];
  examAnswers: Record<string, string>;
  setExamAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  examSubmitted: boolean;
  setExamSubmitted: (v: boolean) => void;
  examScoreSummary: {
    total: number;
    answered: number;
    correct: number;
    pct: number;
  };
  onShowToast: (msg: string) => void;
}

export function Phase4Tab({
  learnSubView,
  setLearnSubView,
  onSelectClip,
  examRoleFilter,
  setExamRoleFilter,
  filteredExams,
  examAnswers,
  setExamAnswers,
  examSubmitted,
  setExamSubmitted,
  examScoreSummary,
  onShowToast,
}: Phase4TabProps) {
  const [examMode, setExamMode] = useState<'slide' | 'all'>('slide');
  const [examSlideIdx, setExamSlideIdx] = useState(0);

  useEffect(() => {
    setExamSlideIdx(0);
  }, [examRoleFilter, filteredExams.length]);

  const answeredPct =
    examScoreSummary.total > 0
      ? Math.round((examScoreSummary.answered / examScoreSummary.total) * 100)
      : 0;

  const renderExamCard = (item: ExamItem) => {
    const picked = examAnswers[item.item_id];
    const optionLines = item.options.split('\n');

    return (
      <SfCard key={item.item_id} className="space-y-4 border border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SfBadge tone="primary">
            <span className="font-mono">
              {item.item_id} · {item.cluster_clip}
            </span>
          </SfBadge>
          <SfBadge tone="mint">{item.target_role}</SfBadge>
        </div>

        <h4 className="font-semibold text-sm md:text-base leading-relaxed text-[var(--ink)]">
          {item.scenario_stem}
        </h4>

        <div className="space-y-2.5">
          {optionLines.map((line) => {
            const letter = line.trim().charAt(0);
            const isPicked = picked === letter;
            const isRight = item.correct_answer === letter;

            let bg = 'var(--bg)';
            let borderColor = 'var(--border)';
            let textColor = 'var(--ink)';
            let fontWeight: number | string = 400;

            if (examSubmitted) {
              if (isRight) {
                bg = 'var(--mint)';
                borderColor = 'var(--positive)';
                textColor = 'var(--positive)';
                fontWeight = 600;
              } else if (isPicked && !isRight) {
                bg = 'var(--rose)';
                borderColor = 'var(--negative)';
                textColor = 'var(--negative)';
              }
            } else if (isPicked) {
              bg = 'var(--primary)';
              borderColor = 'var(--ink)';
              textColor = 'var(--on-primary)';
              fontWeight = 600;
            }

            return (
              <button
                key={letter}
                type="button"
                onClick={() => setExamAnswers((prev) => ({ ...prev, [item.item_id]: letter }))}
                style={{ background: bg, borderColor, color: textColor, fontWeight }}
                className="w-full min-h-[46px] text-left px-4 py-3 rounded-2xl border text-xs md:text-sm transition flex items-start justify-between gap-2 cursor-pointer"
              >
                <span className="leading-relaxed">{line}</span>
                {examSubmitted && isRight && (
                  <CheckCircle2 className="w-4 h-4 text-[var(--positive)] shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {(examSubmitted || picked) && (
          <div className="p-4 rounded-2xl bg-[var(--sky)] text-xs space-y-1.5">
            <div className="font-semibold text-[var(--positive)]">
              เฉลยที่ถูกต้อง: ข้อ {item.correct_answer} | คำอธิบายสัดส่วน 30:70
            </div>
            <div className="whitespace-pre-line leading-relaxed text-[var(--ink)] opacity-90">
              {item.rationale_30_70}
            </div>
          </div>
        )}
      </SfCard>
    );
  };

  return (
    <div className="space-y-5 sf-view-enter">
      <SfCard className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            <div>
              <h2 className="text-base md:text-lg font-semibold">
                สื่อการเรียนรู้ &amp; สอบสมรรถนะ 30:70 (TOR 8.1.3)
              </h2>
              <p className="text-xs text-[var(--muted)]">
                15 คลิป · ข้อสอบจำลอง 15 ข้อ · คัมภีร์ 2 ฉบับ · อินโฟกราฟิก 8 ชิ้น
              </p>
            </div>
          </div>

          <SfSegmented
            label="หมวดสื่อการเรียนรู้"
            value={learnSubView}
            onChange={setLearnSubView}
            options={[
              { value: 'clips', label: '1. วิดีโอ 15 คลิป' },
              { value: 'exam', label: '2. สอบ 30:70' },
              { value: 'playbooks', label: '3. คัมภีร์ & อินโฟ' },
              { value: 'sets', label: '4. ข้อสอบ 12 ชุด' },
            ]}
          />
        </div>
      </SfCard>

      {/* Sub-view 1: 15 Video Clips */}
      {learnSubView === 'clips' && (
        <div className="space-y-5">
          <SlideDeck
            title="สไลด์คลิปเด่นแนะนำ (คลิปยาว 6 ตอนหลัก)"
            subtitle="เลื่อนซ้าย–ขวาเพื่อเปิดอ่าน Storyboard ของแต่ละคลัสเตอร์"
            itemCount={DB.clips15.filter((c) => c.format_duration.includes('คลิปยาว')).length}
            itemClassName="sf-slide-item sf-slide-item--third"
          >
            {DB.clips15
              .filter((c) => c.format_duration.includes('คลิปยาว'))
              .map((clip) => (
                <SfCard
                  key={`long-${clip.clip_code}`}
                  tone="primary"
                  className="h-full flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <SfBadge tone="surface">
                        <span className="font-mono">{clip.clip_code}</span>
                      </SfBadge>
                      <SfBadge tone="surface">{clip.format_duration}</SfBadge>
                    </div>
                    <div className="text-xs opacity-80">
                      {clip.cluster} · {clip.target_role} ({clip.ratio})
                    </div>
                    <h4 className="font-semibold text-base leading-snug">{clip.title}</h4>
                    <p className="text-xs opacity-90 line-clamp-3 leading-relaxed">
                      {clip.learning_objective}
                    </p>
                  </div>
                  <SfButton
                    variant="secondary"
                    onClick={() => onSelectClip(clip)}
                    className="w-full justify-between"
                    style={{ borderColor: 'transparent' }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Play className="w-4 h-4" />
                      <span>เปิด Storyboard</span>
                    </span>
                    <span className="font-mono text-xs">{clip.exam_link}</span>
                  </SfButton>
                </SfCard>
              ))}
          </SlideDeck>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DB.clips15.map((clip) => (
              <SfCard
                key={clip.clip_code}
                className="flex flex-col justify-between gap-3 border border-[var(--border)]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <SfBadge tone="lilac">
                      <span className="font-mono">{clip.clip_code}</span>
                    </SfBadge>
                    <SfBadge tone={clip.format_duration.includes('คลิปยาว') ? 'primary' : 'mint'}>
                      {clip.format_duration}
                    </SfBadge>
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {clip.cluster} · <strong className="text-[var(--ink)]">{clip.target_role}</strong> ({clip.ratio})
                  </div>
                  <h4 className="font-semibold text-sm md:text-base leading-snug">{clip.title}</h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{clip.learning_objective}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-[var(--muted)]">
                    คู่ข้อสอบ: {clip.exam_link}
                  </span>
                  <SfButton
                    variant="ink"
                    onClick={() => onSelectClip(clip)}
                    className="!min-h-[38px] !px-3.5 text-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Storyboard</span>
                  </SfButton>
                </div>
              </SfCard>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view 2: 30:70 Exam Simulator */}
      {learnSubView === 'exam' && (
        <div className="space-y-4">
          <SfCard tone="primary" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>จำลองสอบวัดสมรรถนะ 30:70</span>
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  กฎหมายแม่บท 30% + กฎรอง/คู่มือ/SOP 70%
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SfBadge tone="surface">
                  ทำแล้ว {examScoreSummary.answered}/{examScoreSummary.total} ข้อ
                </SfBadge>
                <SfBadge tone="surface">
                  คะแนน: {examScoreSummary.correct}/{examScoreSummary.total} ({examScoreSummary.pct}%)
                </SfBadge>
              </div>
            </div>

            <progress
              className="sf-progress"
              value={answeredPct}
              max={100}
              aria-label="ความคืบหน้าการทำข้อสอบ"
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={examRoleFilter}
                  onChange={(e) => setExamRoleFilter(e.target.value)}
                  aria-label="กรองชุดข้อสอบตามระดับ"
                  className="sf-input !w-auto !min-h-[42px] text-xs font-semibold"
                >
                  <option value="ALL">ทุกกลุ่มเป้าหมาย (15 ข้อ)</option>
                  <option value="BOARD_TOP">บอร์ด &amp; ผู้บริหารระดับสูง (80:20 / 60:40)</option>
                  <option value="MID">ผู้บริหารระดับกลาง (45:55)</option>
                  <option value="OPER">หัวหน้าฝ่าย &amp; ปฏิบัติงาน (30:70)</option>
                </select>

                <SfSegmented
                  label="โหมดทำข้อสอบ"
                  value={examMode}
                  onChange={setExamMode}
                  options={[
                    { value: 'slide', label: 'สไลด์ทีละข้อ' },
                    { value: 'all', label: 'แสดงทุกข้อ' },
                  ]}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <SfButton
                  variant="ink"
                  onClick={() => {
                    setExamSubmitted(true);
                    onShowToast(
                      `ตรวจคำตอบเรียบร้อย: ได้ ${examScoreSummary.correct}/${examScoreSummary.total} คะแนน (${examScoreSummary.pct}%)`
                    );
                  }}
                >
                  ตรวจคำตอบ &amp; ดูเฉลย 30:70
                </SfButton>
                <SfButton
                  variant="secondary"
                  onClick={() => {
                    setExamAnswers({});
                    setExamSubmitted(false);
                  }}
                  style={{ borderColor: 'transparent' }}
                >
                  เริ่มใหม่
                </SfButton>
              </div>
            </div>
          </SfCard>

          {filteredExams.length === 0 ? (
            <SfCard className="text-center py-8 text-sm text-[var(--muted)]">
              ไม่พบข้อสอบในกลุ่มเป้าหมายที่เลือก
            </SfCard>
          ) : examMode === 'slide' ? (
            <SingleSlideNavigator
              currentIndex={examSlideIdx}
              total={filteredExams.length}
              onChangeIndex={setExamSlideIdx}
              label="ความคืบหน้าสไลด์ข้อสอบ"
            >
              {renderExamCard(filteredExams[examSlideIdx] || filteredExams[0])}
            </SingleSlideNavigator>
          ) : (
            <div className="space-y-4">{filteredExams.map(renderExamCard)}</div>
          )}
        </div>
      )}

      {/* Sub-view 3: Playbooks & Infographics */}
      {learnSubView === 'playbooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DB.playbooksAndInfographics.map((m, idx) => (
            <SfCard
              key={m.media_code}
              tone={idx % 2 === 0 ? 'lilac' : 'sky'}
              className="space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <SfBadge tone="surface">
                    <span className="font-mono">{m.media_code}</span>
                  </SfBadge>
                  <SfBadge tone="surface">{m.media_type}</SfBadge>
                </div>
                <h3 className="font-semibold text-base">{m.scope_clusters}</h3>
                <div className="text-xs text-[var(--ink)] opacity-85">
                  <strong>กลุ่มเป้าหมาย:</strong> {m.target_audience}
                </div>
                <p className="text-xs bg-[var(--surface)] p-3.5 rounded-2xl leading-relaxed">
                  {m.core_content}
                </p>
              </div>
              <div className="text-[11px] font-mono text-[var(--muted)] pt-1">
                อ้างอิง: {m.linked_docs}
              </div>
            </SfCard>
          ))}
        </div>
      )}

      {/* Sub-view 4: 12 Exam Sets Blueprint */}
      {learnSubView === 'sets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DB.examSets12.map((s) => (
            <SfCard key={s.set_code} className="space-y-2.5 border border-[var(--border)]">
              <div className="flex items-center justify-between gap-2">
                <SfBadge tone="primary">
                  <span className="font-mono">{s.set_code}</span>
                </SfBadge>
                <SfBadge tone="mint">{s.weight_ratio}</SfBadge>
              </div>
              <h3 className="font-semibold text-sm md:text-base">{s.set_name}</h3>
              <div className="text-xs text-[var(--muted)]">
                <strong>กลุ่มเป้าหมาย:</strong> {s.target_tier}
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg)] text-xs space-y-1">
                <div>{s.item_composition}</div>
                <div className="font-semibold text-[var(--positive)]">
                  เกณฑ์ผ่าน: {s.passing_criteria}
                </div>
              </div>
            </SfCard>
          ))}
        </div>
      )}
    </div>
  );
}

