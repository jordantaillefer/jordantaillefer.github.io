import { z } from 'zod';

const monthPoint = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/), commits: z.number().int().nonnegative(), partial: z.boolean() });

export const snapshotSchema = z.object({
  measuredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pilote: z.object({
    series: z.array(monthPoint).min(1),
    totalCommits: z.number().int().positive(),
    categories: z.object({ refactor: z.number().int().positive(), feature: z.number().int().positive(), bugfix: z.number().int().nonnegative() }),
  }),
  allProjects: z.object({
    repos: z.number().int().positive(),
    totalCommits: z.number().int().positive(),
    series: z.array(monthPoint).min(1),
  }),
  kauri: z.object({
    commits: z.number().int().positive(),
    specs: z.number().int().nonnegative(),
    plans: z.number().int().nonnegative(),
    testFiles: z.number().int().nonnegative(),
  }),
});

export type Snapshot = z.infer<typeof snapshotSchema>;
