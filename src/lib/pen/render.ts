import { inkPath } from './nib';
import { MONOGRAM } from './monogram';

// L'encre est calculée une fois, au build : le client ne reçoit qu'un SVG statique.
export const MONOGRAM_INK = MONOGRAM.strokes.map((stroke) => ({ ...stroke, ink: inkPath(stroke.d) }));

export const INK_FROM = '#6EE7B7';
export const INK_TO = '#58C9E8';

/** Le monogramme en SVG autonome (favicon, image OG). */
export function monogramSvg({ background }: { background?: string } = {}): string {
  const bg = background ? `<rect x="-10" y="-25" width="160" height="160" rx="34" fill="${background}"/>` : '';
  const strokes = MONOGRAM_INK.map(
    (s) =>
      `<path d="${s.ink}" fill="url(#g)"/><path d="${s.d}" fill="none" stroke="url(#g)" stroke-width="0.9" stroke-linecap="round"/>`,
  ).join('');
  const viewBox = background ? '-10 -25 160 160' : MONOGRAM.viewBox;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="10" y1="20" x2="130" y2="95"><stop offset="0" stop-color="${INK_FROM}"/><stop offset="1" stop-color="${INK_TO}"/></linearGradient></defs>${bg}${strokes}</svg>`;
}
