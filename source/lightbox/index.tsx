"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@sharadox/icon-web-library/icon";
import type { LightboxProperties } from "@sharadox/gallery-web-library/lightbox/type";

/** How far a finger must travel, in pixels, to turn the page. */
const SWIPE = 50;

/**
 * A full-screen photo viewer's behavior and controls, in the site's own design. A click outside the photo, Escape or
 * the close button closes it; with several photos, the chevrons, a swipe and the arrow keys page through them,
 * wrapping around. The page behind doesn't scroll while it's open (smooth scrolling included: `data-lenis-prevent`).
 * The site draws the photo (`children`) and styles everything through `classNames`; to draw it above everything from
 * anywhere, put it in a portal.
 *
 * @example
 * <Lightbox count={photos.length} index={open} onChange={setOpen} label={photo.alt} labels={LABELS} classNames={styles}>
 *   {(index) => <figure className={styles.figure}>…</figure>}
 * </Lightbox>
 */
export function Lightbox({
  count,
  index,
  onChange,
  label,
  labels,
  classNames,
  strokes = {},
  children,
}: LightboxProperties) {
  const touchX = useRef<number | null>(null);
  const [direction, setDirection] = useState(1);
  const browse = count > 1;
  const go = (step: number) => {
    if (!browse || index === null) return;
    setDirection(step);
    onChange((index + step + count) % count, step);
  };
  const latest = useRef({ go, onChange });
  useEffect(() => {
    latest.current = { go, onChange };
  });
  const open = index !== null;
  useEffect(() => {
    if (!open) return;
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") latest.current.onChange(null, 0);
      if (event.key === "ArrowRight") latest.current.go(1);
      if (event.key === "ArrowLeft") latest.current.go(-1);
    };
    addEventListener("keydown", keyDown);
    document.documentElement.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", keyDown);
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  const control = (own: string) => [classNames.control, own].filter(Boolean).join(" ");
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={classNames.lightbox}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null, 0)}
          onTouchStart={(event) => {
            touchX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const end = event.changedTouches[0]?.clientX;
            if (touchX.current !== null && end !== undefined && Math.abs(end - touchX.current) > SWIPE)
              go(end < touchX.current ? 1 : -1);
            touchX.current = null;
          }}
        >
          {children(index, direction)}
          {browse &&
            [
              { label: labels.previous, step: -1, className: classNames.previous, icon: "chevron-left" as const },
              { label: labels.next, step: 1, className: classNames.next, icon: "chevron-right" as const },
            ].map((button) => (
              <button
                key={button.step}
                type="button"
                className={control(button.className)}
                aria-label={button.label}
                onClick={(event) => {
                  event.stopPropagation();
                  go(button.step);
                }}
              >
                <Icon name={button.icon} strokeWidth={strokes.chevron} />
              </button>
            ))}
          <button
            type="button"
            className={control(classNames.close)}
            aria-label={labels.close}
            onClick={(event) => {
              event.stopPropagation();
              onChange(null, 0);
            }}
          >
            <Icon name="close" strokeWidth={strokes.close} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
