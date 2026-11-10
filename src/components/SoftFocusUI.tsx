import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type SfTone = 'default' | 'soft' | 'primary' | 'lilac' | 'rose' | 'mint' | 'sky';

export function SfCard({
  tone = 'default',
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: SfTone }) {
  const toneClass = tone === 'default' ? '' : `sf-card--${tone}`;
  return (
    <section {...props} className={`sf-card ${toneClass} ${className}`.trim()}>
      {children}
    </section>
  );
}

export function SfButton({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'soft' | 'ink' | 'ghost';
}) {
  const variantClass = variant === 'primary' ? '' : `sf-button--${variant}`;
  return (
    <button {...props} type={type} className={`sf-button ${variantClass} ${className}`.trim()}>
      {children}
    </button>
  );
}

export function SfBadge({
  tone = 'default',
  className = '',
  children,
}: {
  tone?: 'default' | 'surface' | 'primary' | 'lilac' | 'rose' | 'mint' | 'sky' | 'positive' | 'negative';
  className?: string;
  children: React.ReactNode;
}) {
  const toneClass = tone === 'default' ? '' : `sf-badge--${tone}`;
  return <span className={`sf-badge ${toneClass} ${className}`.trim()}>{children}</span>;
}

export function SfSegmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className = '',
}: {
  label: string;
  options: Array<{ value: NoInfer<T>; label: string }>;
  value: T;
  onChange: (value: NoInfer<T>) => void;
  className?: string;
}) {
  return (
    <div className={`sf-segmented ${className}`.trim()} role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function SfBottomNav<T extends string>({
  label = 'เมนูหลัก',
  items,
  value,
  onChange,
}: {
  label?: string;
  items: Array<{ value: T; label: string; icon: React.ReactNode }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <nav className="sf-nav" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-current={item.value === value ? 'page' : undefined}
          onClick={() => onChange(item.value)}
        >
          {item.icon}
          <span className="truncate max-w-[68px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/** Horizontal swipeable slide deck with snap scrolling + prev/next controls + dot indicators */
export function SlideDeck({
  title,
  subtitle,
  children,
  itemCount,
  itemClassName = 'sf-slide-item',
  headerExtra,
}: {
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  itemCount: number;
  itemClassName?: string;
  headerExtra?: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || itemCount <= 1) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const step = firstChild.offsetWidth + 16;
    const idx = Math.round(el.scrollLeft / Math.max(step, 1));
    setActiveIndex(Math.min(Math.max(idx, 0), itemCount - 1));
  };

  const scrollToSlide = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const targetChild = el.children[index] as HTMLElement | undefined;
    if (targetChild) {
      el.scrollTo({ left: targetChild.offsetLeft, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  return (
    <div className="space-y-3">
      {(title || itemCount > 1) && (
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-base md:text-lg font-semibold leading-snug">{title}</h2>}
            {subtitle && <p className="text-xs md:text-sm text-[var(--muted)] mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerExtra}
            {itemCount > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="สไลด์ก่อนหน้า"
                  onClick={() => scrollToSlide(Math.max(0, activeIndex - 1))}
                  disabled={activeIndex === 0}
                  className="sf-icon-button"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="สไลด์ถัดไป"
                  onClick={() => scrollToSlide(Math.min(itemCount - 1, activeIndex + 1))}
                  disabled={activeIndex >= itemCount - 1}
                  className="sf-icon-button"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="sf-slide-track"
        role="region"
        aria-roledescription="carousel"
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>

      {itemCount > 1 && itemCount <= 12 && (
        <div className="flex items-center justify-center gap-1.5 pt-1" aria-hidden="true">
          {Array.from({ length: itemCount }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              tabIndex={-1}
              onClick={() => scrollToSlide(idx)}
              className="h-2 rounded-full transition-all"
              style={{
                width: idx === activeIndex ? '20px' : '8px',
                background: idx === activeIndex ? 'var(--ink)' : 'var(--border)',
                border: 0,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Step-by-step interactive slide navigator for focused mobile reading/study/exam */
export function SingleSlideNavigator({
  currentIndex,
  total,
  onChangeIndex,
  label = 'ความคืบหน้าสไลด์',
  children,
}: {
  currentIndex: number;
  total: number;
  onChangeIndex: (index: number) => void;
  label?: string;
  children: React.ReactNode;
}) {
  const safeIndex = Math.min(Math.max(currentIndex, 0), Math.max(total - 1, 0));
  const pct = total > 0 ? Math.round(((safeIndex + 1) / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <SfBadge tone="surface">
            สไลด์ {safeIndex + 1} / {total}
          </SfBadge>
          <progress className="sf-progress max-w-[220px]" value={pct} max={100} aria-label={label} />
          <span className="text-xs text-[var(--muted)] font-medium">{pct}%</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onChangeIndex(Math.max(0, safeIndex - 1))}
            disabled={safeIndex === 0}
            aria-label="สไลด์ก่อนหน้า"
            className="sf-icon-button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangeIndex(Math.min(total - 1, safeIndex + 1))}
            disabled={safeIndex >= total - 1}
            aria-label="สไลด์ถัดไป"
            className="sf-icon-button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div key={safeIndex} className="sf-view-enter">
        {children}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <SfButton
          variant="secondary"
          disabled={safeIndex === 0}
          onClick={() => onChangeIndex(Math.max(0, safeIndex - 1))}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ก่อนหน้า</span>
        </SfButton>
        <SfButton
          variant="primary"
          disabled={safeIndex >= total - 1}
          onClick={() => onChangeIndex(Math.min(total - 1, safeIndex + 1))}
        >
          <span>ถัดไป</span>
          <ChevronRight className="w-4 h-4" />
        </SfButton>
      </div>
    </div>
  );
}

/** Mobile-first slide-up Bottom Sheet / Desktop Modal */
export function MobileSheetModal({
  open,
  onClose,
  title,
  badge,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="sf-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sf-modal-panel sf-view-enter space-y-4">
        <div className="sf-sheet-handle" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <div className="min-w-0 space-y-1.5">
            {badge && <div className="flex flex-wrap items-center gap-2">{badge}</div>}
            <h3 className="text-base md:text-lg font-semibold leading-snug">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="sf-icon-button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">{children}</div>

        {footer && (
          <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-[var(--border)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
