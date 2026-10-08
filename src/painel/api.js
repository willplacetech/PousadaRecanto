export const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export async function api(path, method = 'GET', body) {
  const token = sessionStorage.getItem('recanto-token');
  let response;
  try {
    response = await fetch(`${base}/api${path}`, { method, cache: 'no-store', headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  } catch { throw new Error('Não foi possível conectar. Verifique sua conexão e tente novamente.'); }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && path !== '/auth/login' && sessionStorage.getItem('recanto-token') === token) { sessionStorage.removeItem('recanto-token'); window.dispatchEvent(new Event('recanto-expired')); }
  if (!response.ok) throw new Error([data.mensagem || data.erro || data.detail || 'Não foi possível concluir a operação.', ...(Array.isArray(data.detalhes) ? data.detalhes : [])].join(' '));
  return data;
}
