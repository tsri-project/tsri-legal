import React, { useEffect, useState } from 'react';
import { ExternalLink, Layers, Pencil } from 'lucide-react';
import { MASTER_BUNDLE as DB } from '../../data/tsriDatabase';
import { CrossListItem } from '../../types/portal';
import {
  SfBadge,
  SfButton,
  SfCard,
  SfSegmented,
  SingleSlideNavigator,
} from '../SoftFocusUI';

interface ClustersTabProps {
  activeClusterFilter: string;
  setActiveClusterFilter: (v: string) => void;
  filteredCrossList: CrossListItem[];
  customNotes: Record<string, string>;
  editingNoteCode: string | null;
  setEditingNoteCode: (v: string | null) => void;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  onSaveNote: (clCode: string) => void;
}

export function ClustersTab({
  activeClusterFilter,
  setActiveClusterFilter,
  filteredCrossList,
  customNotes,
  editingNoteCode,
  setEditingNoteCode,
  noteDraft,
  setNoteDraft,
  onSaveNote,
}: ClustersTabProps) {
  const [viewMode, setViewMode] = useState<'slide' | 'list'>('slide');
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [activeClusterFilter, filteredCrossList.length]);

  const renderCrossListCard = (cl: CrossListItem) => (
    <SfCard key={cl.cl_code} className="space-y-4 border border-[var(--border)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-2">
          <SfBadge tone="primary">
            <span className="font-mono">{cl.cl_code}</span>
          </SfBadge>
          <span className="font-semibold text-base text-[var(--ink)]">{cl.cluster}</span>
          <SfBadge tone="sky">{cl.owner}</SfBadge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SfBadge tone="positive">{cl.status}</SfBadge>
          <a
            href={cl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sf-button sf-button--secondary !min-h-[36px] !px-3.5 text-xs"
          >
            <span>เปิดเอกสาร</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--sky)] space-y-1.5">
          <div className="font-semibold text-sm text-[var(--ink)]">
            ระยะที่ 1–2: ฐานกฎหมาย 3 ระดับ &amp; คลัง 100 ไฟล์
          </div>
          <p className="whitespace-pre-line leading-relaxed text-[var(--ink)] opacity-90">
            {cl.phase1_2_legal}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--mint)] space-y-1.5">
          <div className="font-semibold text-sm text-[var(--ink)]">
            ระยะที่ 3: เกณฑ์ C1 / C2 / A &amp; ภาคสนาม
          </div>
          <p className="whitespace-pre-line leading-relaxed text-[var(--ink)] opacity-90">
            {cl.phase3_c1_c2_a}
          </p>
          <div className="pt-2 mt-2 border-t border-black/10 text-[11px] text-[var(--muted)] font-medium">
            {cl.phase3_tools}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--lilac)] flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
            <div className="font-semibold text-sm text-[var(--ink)]">
              ระยะที่ 4: สื่อ 15 คลิป &amp; ข้อสอบ 30:70
            </div>
            <p className="leading-relaxed text-[var(--ink)] opacity-90">{cl.phase4_media_exam}</p>
          </div>

          <div className="pt-3 border-t border-black/10">
            {editingNoteCode === cl.cl_code ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="เพิ่มบันทึกการตรวจแฟ้มหรือข้อสังเกต..."
                  className="sf-input text-xs !min-h-[72px]"
                />
                <div className="flex gap-2">
                  <SfButton
                    variant="ink"
                    onClick={() => onSaveNote(cl.cl_code)}
                    className="!min-h-[36px] text-xs"
                  >
                    บันทึก
                  </SfButton>
                  <SfButton
                    variant="secondary"
                    onClick={() => setEditingNoteCode(null)}
                    className="!min-h-[36px] text-xs"
                  >
                    ยกเลิก
                  </SfButton>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--muted)] italic line-clamp-2">
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
                  className="sf-button sf-button--secondary !min-h-[32px] !px-3 text-[11px] shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                  <span>บันทึก</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SfCard>
  );

  return (
    <div className="space-y-5 sf-view-enter">
      <SfCard className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <span>แผนผัง 9 คลัสเตอร์ &amp; Cross-List 15 ข้อ</span>
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              112 ภารกิจ · 159 คู่เชื่อมเอกสาร (CL-01 ถึง CL-15)
            </p>
          </div>

          <SfSegmented
            label="รูปแบบการแสดงผล Cross-List"
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'slide', label: 'สไลด์ทีละข้อ' },
              { value: 'list', label: `รายการทั้งหมด (${filteredCrossList.length})` },
            ]}
          />
        </div>

        {/* Swipeable Cluster Filter Pills */}
        <div className="sf-pill-scroll" role="group" aria-label="กรองตามคลัสเตอร์">
          <button
            type="button"
            className="sf-pill-chip"
            aria-pressed={activeClusterFilter === 'ALL'}
            onClick={() => setActiveClusterFilter('ALL')}
          >
            ทุกคลัสเตอร์ (15)
          </button>
          {DB.clusters9.map((c) => (
            <button
              key={c.cluster}
              type="button"
              className="sf-pill-chip"
              aria-pressed={activeClusterFilter === c.cluster}
              onClick={() => setActiveClusterFilter(c.cluster)}
            >
              {c.cluster} ({c.doc_links_count})
            </button>
          ))}
        </div>
      </SfCard>

      {filteredCrossList.length === 0 ? (
        <SfCard className="text-center py-10 text-sm text-[var(--muted)]">
          ไม่พบข้อมูล Cross-List ที่ตรงกับคำค้นหา
        </SfCard>
      ) : viewMode === 'slide' ? (
        <SingleSlideNavigator
          currentIndex={slideIndex}
          total={filteredCrossList.length}
          onChangeIndex={setSlideIndex}
          label="ความคืบหน้าสไลด์ Cross-List"
        >
          {renderCrossListCard(filteredCrossList[slideIndex] || filteredCrossList[0])}
        </SingleSlideNavigator>
      ) : (
        <div className="space-y-4">{filteredCrossList.map(renderCrossListCard)}</div>
      )}
    </div>
  );
}

