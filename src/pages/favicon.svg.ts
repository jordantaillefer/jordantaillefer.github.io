import type { APIRoute } from 'astro';
import { monogramSvg } from '../lib/pen/render';

export const GET: APIRoute = () =>
  new Response(monogramSvg({ background: '#14161B' }), { headers: { 'Content-Type': 'image/svg+xml' } });
