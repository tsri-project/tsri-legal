import React, { useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { MASTER_BUNDLE as DB } from '../../data/tsriDatabase';
import { C1C2ARating, InterviewQuestion } from '../../types/portal';
import {
  SfBadge,
  SfCard,
  SfSegmented,
  SingleSlideNavigator,
} from '../SoftFocusUI';

interface Phase3TabProps {
  fieldSubView: 'questions' | 'sampling' | 'fgd' | 'chains';
  setFieldSubView: (v: 'questions' | 'sampling' | 'fgd' | 'chains') => void;
  questionGroupFilter: string;
  setQuestionGroupFilter: (v: string) => void;
  filteredQuestions: InterviewQuestion[];
  c1c2aRatings: Record<string, C1C2ARating>;
  onSetRating: (qCode: string, dim: 'C1' | 'C2' | 'A', val: string) => void;
}

export function Phase3Tab({
  fieldSubView,
  setFieldSubView,
  questionGroupFilter,
  setQuestionGroupFilter,
  filteredQuestions,
  c1c2aRatings,
  onSetRating,
}: Phase3TabProps) {
  const [questionDisplay, setQuestionDisplay] = useState<'slide' | 'list'>('slide');
  const [qSlideIdx, setQSlideIdx] = useState(0);

  useEffect(() => {
    setQSlideIdx(0);
  }, [questionGroupFilter, filteredQuestions.length]);

  const renderQuestionCard = (q: InterviewQuestion) => {
    const currentScore = c1c2aRatings[q.q_code] || {
      C1: 'ครบถ้วน/สอดคล้อง (Pass)',
      C2: 'ครบถ้วน/สอดคล้อง (Pass)',
      A: 'ครบถ้วน/สอดคล้อง (Pass)',
    };

    return (
      <SfCard key={q.q_code} className="space-y-4 border border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[var(--border)]">
          <SfBadge tone="primary">
            <span className="font-mono">{q.q_code}</span>
          </SfBadge>
          <SfBadge tone="mint">{q.instrument_group}</SfBadge>
          <SfBadge tone="surface">เป้าหมาย: {q.target_role}</SfBadge>
          <SfBadge tone="lilac">มิติ: {q.dim_d1_d5}</SfBadge>
        </div>

        <div className="font-semibold text-sm md:text-base leading-relaxed text-[var(--ink)]">
          {q.question_text}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[var(--sky)] space-y-1">
            <div className="font-semibold text-[var(--ink)]">จุดปลั๊กอินกฎหมาย &amp; เอกสารอ้างอิง</div>
            <div className="text-[var(--ink)] opacity-85 leading-relaxed">{q.legal_plugin}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--mint)] space-y-1">
            <div className="font-semibold text-[var(--ink)]">เกณฑ์ประเมิน C1 / C2 / A</div>
            <div className="whitespace-pre-line text-[var(--ink)] opacity-85 leading-relaxed">
              {q.c1_c2_a_rubric}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--rose)] space-y-2.5">
            <div className="font-semibold text-[var(--ink)]">จำแนกช่องว่าง &amp; บันทึกผลสนาม</div>
            <div className="text-[var(--ink)] opacity-85 leading-relaxed">{q.gap_Rule}</div>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {(['C1', 'C2', 'A'] as const).map((dim) => (
                <select
                  key={dim}
                  value={currentScore[dim]}
                  onChange={(e) => onSetRating(q.q_code, dim, e.target.value)}
                  aria-label={`ประเมิน ${dim} ข้อ ${q.q_code}`}
                  className="sf-input !min-h-[38px] !py-1.5 !px-3 text-xs font-semibold"
                >
                  <option value="ครบถ้วน/สอดคล้อง (Pass)">{dim}: ผ่านเกณฑ์ (Pass)</option>
                  <option value="รอหลักฐาน (Evidence Gap)">{dim}: รอแฟ้ม (Evidence Gap)</option>
                  <option value="พบช่องว่าง (Gap Found)">{dim}: พบช่องว่าง (Gap)</option>
                </select>
              ))}
            </div>
          </div>
        </div>
      </SfCard>
    );
  };

  return (
    <div className="space-y-5 sf-view-enter">
      <SfCard className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            <div>
              <h2 className="text-base md:text-lg font-semibold">
                เครื่องมือภาคสนามระยะที่ 3 (N=80 · C1/C2/A)
              </h2>
              <p className="text-xs text-[var(--muted)]">
                32 คำถามสัมภาษณ์ · 6 FGD · 6 ห่วงโซ่ตรวจแฟ้มจริง
              </p>
            </div>
          </div>

          <SfSegmented
            label="เครื่องมือระยะที่ 3"
            value={fieldSubView}
            onChange={setFieldSubView}
            options={[
              { value: 'questions', label: '1. สัมภาษณ์ 32 ข้อ' },
              { value: 'sampling', label: '2. ตัวอย่าง 80 คน' },
              { value: 'fgd', label: '3. 6 FGD' },
              { value: 'chains', label: '4. ตรวจแฟ้ม 6 สาย' },
            ]}
          />
        </div>

        {fieldSubView === 'questions' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
            <div className="sf-pill-scroll" role="group" aria-label="กลุ่มคำถาม">
              {[
                { id: 'ALL', label: 'ทั้งหมด (32)' },
                { id: 'CORE', label: 'Check & Balance (Q01–Q12)' },
                { id: 'EXEC', label: 'ผู้บริหาร (QH01–QH10)' },
                { id: 'OPER', label: 'ปฏิบัติการ (QO01–QO10)' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className="sf-pill-chip"
                  aria-pressed={questionGroupFilter === g.id}
                  onClick={() => setQuestionGroupFilter(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <SfSegmented
              label="รูปแบบการแสดงคำถาม"
              value={questionDisplay}
              onChange={setQuestionDisplay}
              options={[
                { value: 'slide', label: 'สไลด์ทีละข้อ' },
                { value: 'list', label: 'ทั้งหมด' },
              ]}
            />
          </div>
        )}
      </SfCard>

      {/* Sub-view 1: 32 Questions */}
      {fieldSubView === 'questions' && (
        <div className="space-y-4">
          <SfCard tone="sky" className="!p-4 text-xs leading-relaxed">
            <strong>กฎเหล็กการวินิจฉัยช่องว่างระยะที่ 3:</strong> แยกแยะ{' '}
            <strong>Evidence Gap</strong> (อยู่ระหว่างรอแฟ้มเอกสารหลักฐาน) ออกจาก{' '}
            <strong>Compliance Gap</strong> (มีหลักฐานยืนยันว่าปฏิบัติไม่ตรงตามฐานอำนาจหรือเงื่อนไขตามกฎหมาย)
          </SfCard>

          {filteredQuestions.length === 0 ? (
            <SfCard className="text-center py-8 text-sm text-[var(--muted)]">
              ไม่พบข้อคำถามที่ตรงกับคำค้นหา
            </SfCard>
          ) : questionDisplay === 'slide' ? (
            <SingleSlideNavigator
              currentIndex={qSlideIdx}
              total={filteredQuestions.length}
              onChangeIndex={setQSlideIdx}
              label="ความคืบหน้าข้อคำถามสัมภาษณ์"
            >
              {renderQuestionCard(filteredQuestions[qSlideIdx] || filteredQuestions[0])}
            </SingleSlideNavigator>
          ) : (
            <div className="space-y-4">{filteredQuestions.map(renderQuestionCard)}</div>
          )}
        </div>
      )}

      {/* Sub-view 2: Sampling N=80 */}
      {fieldSubView === 'sampling' && (
        <div className="space-y-5">
          <SfCard className="space-y-3">
            <h3 className="text-base font-semibold">
              กลุ่มตัวอย่างผู้ให้ข้อมูลสำคัญ N = 80 คน (ไม่นับซ้ำ) · GUIDE-WS03-001-2569
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DB.sampling80.map((grp) => (
                <div
                  key={grp.group_code}
                  className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <SfBadge tone="primary">{grp.group_code}</SfBadge>
                    <SfBadge tone="positive">{grp.unique_count} คน</SfBadge>
                  </div>
                  <div className="font-semibold text-sm text-[var(--ink)]">{grp.group_name}</div>
                  <div className="text-[11px] font-mono text-[var(--muted)]">{grp.slot_range}</div>
                  <p className="whitespace-pre-line text-[var(--muted)] leading-relaxed">
                    {grp.composition}
                  </p>
                  <div className="pt-2 border-t border-[var(--border)] space-y-1">
                    <div className="font-semibold text-[var(--ink)]">{grp.instrument_code}</div>
                    <div className="text-[var(--muted)]">{grp.focus_c1_c2_a}</div>
                    <div className="font-semibold text-[var(--positive)]">{grp.knowledge_ratio}</div>
                  </div>
                </div>
              ))}
            </div>
          </SfCard>

          <SfCard className="space-y-3 overflow-x-auto">
            <h3 className="text-base font-semibold">
              โครงสร้างส่วนงาน สกสว. พ.ศ. 2569 (5 สำนัก 24 ฝ่าย · 6 หน่วยภารกิจ · 1 IA = 31 หน่วย)
            </h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-soft)] text-[var(--ink)] border-b border-[var(--border)]">
                  <th className="py-2.5 px-3 rounded-l-xl">ส่วนงาน</th>
                  <th className="py-2.5 px-3">Slot &amp; จำนวนคน</th>
                  <th className="py-2.5 px-3">รายชื่อฝ่าย / หน่วยย่อย</th>
                  <th className="py-2.5 px-3">กระบวนงาน</th>
                  <th className="py-2.5 px-3 rounded-r-xl">เอกสารหลัก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {DB.bureauMap27.map((b) => (
                  <tr key={b.unit_code} className="hover:bg-[var(--bg)]">
                    <td className="py-2.5 px-3 font-semibold">
                      {b.unit_code}
                      <div className="text-[11px] font-normal text-[var(--muted)]">{b.unit_name}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold whitespace-nowrap">{b.slots}</td>
                    <td className="py-2.5 px-3 text-[var(--muted)]">{b.divisions}</td>
                    <td className="py-2.5 px-3 font-medium text-[var(--positive)]">{b.processes}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--muted)]">{b.key_docs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SfCard>
        </div>
      )}

      {/* Sub-view 3: 6 FGDs */}
      {fieldSubView === 'fgd' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DB.fgdAndWorkshops.map((fgd) => (
            <SfCard key={fgd.fgd_code} className="space-y-3 border border-[var(--border)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SfBadge tone="primary">
                  <span className="font-mono">{fgd.fgd_code}</span>
                </SfBadge>
                <SfBadge tone="lilac">
                  {fgd.clusters} · {fgd.processes}
                </SfBadge>
              </div>
              <h3 className="font-semibold text-sm md:text-base">{fgd.title}</h3>
              <p className="text-xs text-[var(--muted)]">
                <strong>ผู้เข้าร่วม:</strong> {fgd.participants} ({fgd.duration})
              </p>
              <div className="p-3.5 rounded-2xl bg-[var(--bg)] text-xs whitespace-pre-line leading-relaxed">
                {fgd.key_issues}
              </div>
              <div className="p-3 rounded-2xl bg-[var(--mint)] text-xs font-medium text-[var(--positive)]">
                <strong>ผลลัพธ์:</strong> {fgd.expected_outputs}
              </div>
            </SfCard>
          ))}
        </div>
      )}

      {/* Sub-view 4: 6 Fieldwork Chains */}
      {fieldSubView === 'chains' && (
        <div className="space-y-4">
          {DB.fieldworkChains6.map((ch) => (
            <SfCard key={ch.chain_code} className="space-y-3 border border-[var(--border)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SfBadge tone="sky">
                  <span className="font-mono">{ch.chain_code}</span>
                </SfBadge>
                <h3 className="font-semibold text-sm md:text-base flex-1">{ch.chain_name}</h3>
                <span className="text-xs font-medium text-[var(--muted)]">{ch.bureaus}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[var(--sky)] space-y-1">
                  <div className="font-semibold">ฐานกฎหมายแม่บท (D1)</div>
                  <div className="opacity-90 leading-relaxed">{ch.statutory_basis}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--lilac)] space-y-1">
                  <div className="font-semibold">กฎรอง คู่มือ และ SOP (D2)</div>
                  <div className="opacity-90 leading-relaxed">{ch.operational_rules}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--mint)] space-y-1">
                  <div className="font-semibold text-[var(--positive)]">หลักฐานในแฟ้มจริง (D5)</div>
                  <div className="whitespace-pre-line opacity-90 leading-relaxed">
                    {ch.empirical_evidence}
                  </div>
                </div>
              </div>
            </SfCard>
          ))}
        </div>
      )}
    </div>
  );
}

