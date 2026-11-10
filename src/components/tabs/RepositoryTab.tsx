import React, { useState } from 'react';
import { ExternalLink, Eye, Filter, LayoutGrid, Table2 } from 'lucide-react';
import { MASTER_BUNDLE as DB } from '../../data/tsriDatabase';
import { LegalDocument, StatutorySection } from '../../types/portal';
import { SfBadge, SfButton, SfCard, SfSegmented, SlideDeck } from '../SoftFocusUI';

interface RepositoryTabProps {
  repoSubView: 'files' | 'sections';
  setRepoSubView: (v: 'files' | 'sections') => void;
  selectedCat: string;
  setSelectedCat: (v: string) => void;
  selectedCluster: string;
  setSelectedCluster: (v: string) => void;
  selectedTorLevel: string;
  setSelectedTorLevel: (v: string) => void;
  onlyActiveFiles: boolean;
  setOnlyActiveFiles: (v: boolean) => void;
  globalSearch: string;
  onClearAllFilters: () => void;
  filteredDocs: LegalDocument[];
  filteredSections: StatutorySection[];
  onInspectDoc: (doc: LegalDocument) => void;
}

export function RepositoryTab({
  repoSubView,
  setRepoSubView,
  selectedCat,
  setSelectedCat,
  selectedCluster,
  setSelectedCluster,
  selectedTorLevel,
  setSelectedTorLevel,
  onlyActiveFiles,
  setOnlyActiveFiles,
  globalSearch,
  onClearAllFilters,
  filteredDocs,
  filteredSections,
  onInspectDoc,
}: RepositoryTabProps) {
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('cards');
  const [showFilters, setShowFilters] = useState(true);

  const hasActiveFilter =
    selectedCat !== 'ALL' ||
    selectedCluster !== 'ALL' ||
    selectedTorLevel !== 'ALL' ||
    onlyActiveFiles ||
    Boolean(globalSearch);

  return (
    <div className="space-y-4 sf-view-enter">
      {/* Control Card */}
      <SfCard className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <SfSegmented
            label="โหมดสืบค้นคลังกฎหมาย"
            value={repoSubView}
            onChange={setRepoSubView}
            options={[
              { value: 'files', label: `ทะเบียน 11 หมวด (${filteredDocs.length}/101)` },
              { value: 'sections', label: `ตัวบทมาตรา (${filteredSections.length})` },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2">
            <SfButton
              variant="secondary"
              onClick={() => setShowFilters((s) => !s)}
              className="!min-h-[38px] !px-3.5 text-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showFilters ? 'ซ่อนตัวกรอง' : 'ตัวกรอง'}</span>
            </SfButton>

            <div className="sf-segmented">
              <button
                type="button"
                aria-pressed={displayMode === 'cards'}
                onClick={() => setDisplayMode('cards')}
                className="inline-flex items-center gap-1"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>การ์ด</span>
              </button>
              <button
                type="button"
                aria-pressed={displayMode === 'table'}
                onClick={() => setDisplayMode('table')}
                className="inline-flex items-center gap-1"
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>ตาราง</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips & Selects */}
        {showFilters && (
          <div className="pt-3 border-t border-[var(--border)] space-y-3">
            {/* Quick Horizontal Cluster Slide Filter */}
            <div className="sf-pill-scroll" role="group" aria-label="กรองตามคลัสเตอร์">
              <button
                type="button"
                className="sf-pill-chip"
                aria-pressed={selectedCluster === 'ALL'}
                onClick={() => setSelectedCluster('ALL')}
              >
                ทุกคลัสเตอร์
              </button>
              {['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4'].map((cl) => (
                <button
                  key={cl}
                  type="button"
                  className="sf-pill-chip"
                  aria-pressed={selectedCluster === cl}
                  onClick={() => setSelectedCluster(cl)}
                >
                  Cluster {cl}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                aria-label="เลือกหมวดเอกสาร"
                className="sf-input text-sm"
              >
                <option value="ALL">ทุกหมวด (หมวดที่ 1–11)</option>
                {DB.categories11.map((c, i) => (
                  <option key={c.cat_no} value={String(i + 1)}>
                    {c.cat_no}: {c.cat_name} ({c.active_count} ไฟล์)
                  </option>
                ))}
              </select>

              <select
                value={selectedTorLevel}
                onChange={(e) => setSelectedTorLevel(e.target.value)}
                aria-label="เลือกระดับ TOR"
                className="sf-input text-sm"
              >
                <option value="ALL">ทุกระดับตามกรอบ TOR 4.1.1</option>
                <option value="ระดับที่ 1">ระดับที่ 1: กฎหมายจัดตั้ง</option>
                <option value="ระดับที่ 2">ระดับที่ 2: กฎรอง / คู่มือ / SOP</option>
                <option value="ระดับที่ 3">ระดับที่ 3: กฎหมายที่เกี่ยวข้อง &amp; ม.77</option>
              </select>

              <label className="sf-input flex items-center gap-2.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={onlyActiveFiles}
                  onChange={(e) => setOnlyActiveFiles(e.target.checked)}
                  className="w-4 h-4 accent-[var(--positive)]"
                />
                <span>เฉพาะ 100 ไฟล์ใช้งานจริง</span>
              </label>

              {hasActiveFilter && (
                <SfButton variant="soft" onClick={onClearAllFilters} className="w-full">
                  ล้างตัวกรองทั้งหมด
                </SfButton>
              )}
            </div>
          </div>
        )}
      </SfCard>

      {/* Featured Highlight Slide Deck when in Files Card Mode */}
      {repoSubView === 'files' && displayMode === 'cards' && filteredDocs.length > 0 && (
        <SlideDeck
          title="สไลด์เอกสารแนะนำในชุดที่กรอง"
          subtitle="เลื่อนซ้าย–ขวาเพื่อเปิดดูเอกสารเด่นอย่างรวดเร็ว"
          itemCount={Math.min(filteredDocs.length, 6)}
          itemClassName="sf-slide-item sf-slide-item--third"
        >
          {filteredDocs.slice(0, 6).map((doc) => (
            <SfCard
              key={`slide-${doc.tsri_f}`}
              tone={doc.is_active ? 'lilac' : 'rose'}
              className="h-full flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <SfBadge tone="surface">
                    <span className="font-mono">{doc.tsri_f}</span>
                  </SfBadge>
                  <SfBadge tone={doc.is_active ? 'positive' : 'negative'}>
                    {doc.is_active ? 'ใช้งานจริง' : 'ซ้ำ/ถอน'}
                  </SfBadge>
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 leading-snug">{doc.formal_title}</h3>
                <p className="text-xs text-[var(--muted)] line-clamp-2">{doc.key_provisions}</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <SfButton
                  variant="secondary"
                  onClick={() => onInspectDoc(doc)}
                  className="flex-1 !min-h-[38px] text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>รายละเอียด</span>
                </SfButton>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-icon-button"
                  aria-label="เปิดไฟล์ Google Drive"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </SfCard>
          ))}
        </SlideDeck>
      )}

      {/* Main Results View */}
      {repoSubView === 'files' ? (
        filteredDocs.length === 0 ? (
          <SfCard className="text-center py-10 space-y-3">
            <p className="text-sm text-[var(--muted)]">ไม่พบเอกสารที่ตรงกับเงื่อนไขการค้นหา</p>
            <SfButton variant="secondary" onClick={onClearAllFilters}>
              ล้างตัวกรองเพื่อดูทั้งหมด
            </SfButton>
          </SfCard>
        ) : displayMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <SfCard
                key={doc.tsri_f}
                tone={doc.is_active ? 'default' : 'rose'}
                className="flex flex-col justify-between gap-3 border border-[var(--border)]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <SfBadge tone="primary">
                        <span className="font-mono">{doc.tsri_f}</span>
                      </SfBadge>
                      <SfBadge tone="surface">{doc.doc_id}</SfBadge>
                    </div>
                    <SfBadge tone={doc.is_active ? 'positive' : 'negative'}>{doc.status}</SfBadge>
                  </div>

                  <div className="text-xs text-[var(--muted)]">
                    {doc.cat_label} · {doc.tor_level}
                  </div>
                  <h3 className="text-sm md:text-base font-semibold leading-snug">{doc.formal_title}</h3>
                  <p className="text-xs text-[var(--muted)] line-clamp-3 leading-relaxed">
                    {doc.key_provisions}
                  </p>
                  <div className="p-2.5 rounded-2xl bg-[var(--bg)] text-xs space-y-1">
                    <div>
                      <span className="font-semibold">ฐานอำนาจ:</span>{' '}
                      <span className="text-[var(--muted)]">{doc.legal_basis}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Clusters:</span>{' '}
                      <span className="text-[var(--positive)] font-semibold">{doc.clusters}</span>{' '}
                      <span className="text-[var(--muted)]">({doc.owner_bureau})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)]">
                  <SfButton
                    variant="ink"
                    onClick={() => onInspectDoc(doc)}
                    className="!min-h-[40px] text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ดูรายละเอียด</span>
                  </SfButton>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-button sf-button--secondary !min-h-[40px] text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>เปิดไฟล์ Drive</span>
                  </a>
                </div>
              </SfCard>
            ))}
          </div>
        ) : (
          <SfCard className="overflow-x-auto p-4">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-soft)] text-[var(--ink)] border-b border-[var(--border)]">
                  <th className="py-2.5 px-3 rounded-l-xl">รหัสทะเบียน</th>
                  <th className="py-2.5 px-3">หมวด / ระดับ TOR</th>
                  <th className="py-2.5 px-3">ชื่อเอกสารและสาระสำคัญ</th>
                  <th className="py-2.5 px-3">ฐานอำนาจเชื่อมโยง</th>
                  <th className="py-2.5 px-3 text-center">Clusters</th>
                  <th className="py-2.5 px-3 text-center rounded-r-xl">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.tsri_f}
                    className={doc.is_active ? 'hover:bg-[var(--bg)]' : 'bg-[var(--rose)]/40'}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold whitespace-nowrap">
                      <div>{doc.tsri_f}</div>
                      <div className="text-[11px] text-[var(--muted)]">{doc.doc_id}</div>
                      <SfBadge tone={doc.is_active ? 'positive' : 'negative'} className="mt-1">
                        {doc.status}
                      </SfBadge>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold">{doc.cat_label}</div>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">{doc.tor_level}</div>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">{doc.owner_bureau}</div>
                    </td>
                    <td className="py-2.5 px-3 max-w-md">
                      <div className="font-semibold">{doc.formal_title}</div>
                      <div className="text-[var(--muted)] mt-1 line-clamp-2">{doc.key_provisions}</div>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs text-[var(--muted)]">{doc.legal_basis}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-[var(--positive)]">
                      {doc.clusters}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex flex-col gap-1.5 items-center">
                        <button
                          type="button"
                          onClick={() => onInspectDoc(doc)}
                          className="sf-button sf-button--ink !min-h-[34px] !px-3 text-[11px] w-full"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดูข้อมูล</span>
                        </button>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sf-button sf-button--secondary !min-h-[34px] !px-3 text-[11px] w-full"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Drive</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SfCard>
        )
      ) : displayMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSections.map((sec) => (
            <SfCard key={sec.id} className="flex flex-col justify-between gap-3 border border-[var(--border)]">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SfBadge tone="sky">{sec.section}</SfBadge>
                  <SfBadge tone="mint">{sec.cluster}</SfBadge>
                </div>
                <div className="text-xs font-semibold text-[var(--muted)]">
                  {sec.act_name} · <span className="font-mono">{sec.doc_code}</span> (หน้า {sec.page})
                </div>
                <p className="text-xs md:text-sm leading-relaxed">{sec.text}</p>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-end">
                <a
                  href={sec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-button sf-button--secondary !min-h-[38px] text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดราชกิจจาฯ</span>
                </a>
              </div>
            </SfCard>
          ))}
        </div>
      ) : (
        <SfCard className="overflow-x-auto p-4">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface-soft)] text-[var(--ink)] border-b border-[var(--border)]">
                <th className="py-2.5 px-3 rounded-l-xl">กฎหมายแม่บท</th>
                <th className="py-2.5 px-3">มาตรา</th>
                <th className="py-2.5 px-3">Cluster</th>
                <th className="py-2.5 px-3">สาระสำคัญของบทบัญญัติ</th>
                <th className="py-2.5 px-3 text-center rounded-r-xl">ต้นฉบับ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredSections.map((sec) => (
                <tr key={sec.id} className="hover:bg-[var(--bg)]">
                  <td className="py-2.5 px-3 font-semibold whitespace-nowrap">
                    <div>{sec.act_name}</div>
                    <div className="text-[11px] font-mono text-[var(--muted)]">{sec.doc_code}</div>
                  </td>
                  <td className="py-2.5 px-3 font-bold whitespace-nowrap">
                    {sec.section}
                    <div className="text-[10px] text-[var(--muted)]">หน้า {sec.page}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[var(--positive)]">{sec.cluster}</td>
                  <td className="py-2.5 px-3 text-[var(--muted)] leading-relaxed">{sec.text}</td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <a
                      href={sec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sf-button sf-button--secondary !min-h-[34px] !px-3 text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ราชกิจจาฯ</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SfCard>
      )}
    </div>
  );
}

