import raw from './snapshot.json';
import { snapshotSchema } from './snapshot.schema';
import { multiplier } from '../lib/stats';

// Validé au build : un snapshot mal formé casse le build plutôt que d'afficher n'importe quoi.
export const snapshot = snapshotSchema.parse(raw);

export const growth = multiplier(snapshot.pilote.series, 2025);

/** Le même calcul sur tous les dépôts, perso compris. */
export const allGrowth = multiplier(snapshot.allProjects.series, 2025);

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export function formatMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  return `${MONTHS[m - 1]} ${year}`;
}

export function formatDay(day: string): string {
  const [year, m, d] = day.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${year}`;
}
