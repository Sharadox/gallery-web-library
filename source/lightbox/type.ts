import type { ReactNode } from "react";

export interface LightboxProperties {
  /** How many photos it pages through; with one, it shows just that one (no paging). */
  count: number;
  /** The photo shown, or null when closed. */
  index: number | null;
  /** Shows another photo (or null to close), with the step that led there (+1, -1, or 0 for closing). */
  onChange: (index: number | null, step: number) => void;
  /** The dialog's name for assistive technology: usually the shown photo's description. */
  label: string;
  /** The controls' names, in the visitor's language. */
  labels: { close: string; previous: string; next: string };
  /** The site's classes: the full-screen backdrop, and each control (a control gets `control` and its own). */
  classNames: { lightbox: string; control?: string; close: string; previous: string; next: string };
  /** Stroke widths of the controls' icons. */
  strokes?: { close?: number; chevron?: number };
  /**
   * The shown photo, drawn by the site (its own figure, caption and animation): given its index and the direction of
   * the last step, for slides that follow the visitor.
   */
  children: (index: number, direction: number) => ReactNode;
}
