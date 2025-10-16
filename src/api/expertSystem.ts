const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  // Si API_BASE está definido, construimos absoluta hacia el backend
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const url = new URL(base + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
}

export async function searchNdjson(params: {
  q?: string;
  page?: number;
  page_size?: number;
  genre?: string;
  platform?: string;
  min_rating?: number;
  min_metacritic?: number;
  released_from?: string;
  released_to?: string;
  only_released?: boolean;
  multiplayer?: boolean;
  age_max?: number;
}) {
  const url = buildUrl('/expert-system/search-ndjson', params);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error en búsqueda');
  return res.json();
}

export async function diagnose(payload: any) {
  const url = buildUrl('/expert-system/diagnose');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error en diagnóstico');
  return res.json();
}

export async function toNdjson() {
  const url = buildUrl('/expert-system/to-ndjson');
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error('Error al convertir a NDJSON');
  return res.json();
}

export function downloadCatalog(params: {
  api_key: string;
  max_pages?: number;
  page_size?: number;
  genres?: string;
  platforms?: string;
  ordering?: string;
}) {
  const url = buildUrl('/expert-system/download-catalog', params);
  window.open(url, '_blank');
}
