import nodeIcal from 'node-ical';
import { isIP } from 'node:net';
import { lookup } from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import fetch from 'node-fetch';

export const validateCalendarUrl = value => {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('URL iCal deve usar HTTP(S) sem credenciais');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host) && !publicAddress(host)) throw new Error('URL iCal deve apontar para rede pública');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) throw new Error('URL iCal deve apontar para rede pública');
  return url;
};

export const publicAddress = address => {
  if (isIP(address) === 4) {
    const [a, b] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || b === 2)) || (a === 198 && [18, 19, 51].includes(b)) || (a === 203 && b === 0));
  }
  // Only global unicast IPv6; excludes mapped IPv4, multicast and local ranges.
  return isIP(address) === 6 && /^[23]/i.test(address) && !/^2001:(?:db8|0|2|10|20):/i.test(address) && !/^2002:/i.test(address);
};

export const downloadCalendar = async value => {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 30000);
  try {
    let url = validateCalendarUrl(value);
    for (let redirects = 0; redirects <= 3; redirects++) {
      const host = url.hostname.replace(/^\[|\]$/g, '');
      const addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await lookup(host, { all: true });
      if (!addresses.length || addresses.some(a => !publicAddress(a.address))) throw new Error('URL iCal resolve para rede privada ou reservada');
      const pinned = addresses[0];
      const Agent = url.protocol === 'https:' ? https.Agent : http.Agent;
      const agent = new Agent({ lookup: (_host, options, callback) => options?.all ? callback(null, [pinned]) : callback(null, pinned.address, pinned.family) });
      try {
        const response = await fetch(url, { signal: abort.signal, redirect: 'manual', agent, size: 5 * 1024 * 1024 });
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get('location');
          if (!location) throw new Error('Redirecionamento iCal sem destino');
          response.body?.destroy();
          url = validateCalendarUrl(new URL(location, url).href);
          continue;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      } finally { agent.destroy(); }
    }
    throw new Error('Muitos redirecionamentos iCal');
  } finally { clearTimeout(timer); }
};

export const parseCalendar = text => {
  const body = text.replace(/^\uFEFF/, '').trim();
  if (!/^BEGIN:VCALENDAR\r?\n/i.test(body) || !/\r?\nEND:VCALENDAR$/i.test(body) || !/^VERSION:2\.0\r?$/im.test(body)) throw new Error('Calendário iCal inválido');
  const starts = (body.match(/^BEGIN:VEVENT\r?$/gim) || []).length;
  if (starts !== (body.match(/^END:VEVENT\r?$/gim) || []).length) throw new Error('Calendário iCal incompleto');
  const events = Object.values(nodeIcal.sync.parseICS(body)).filter(e => e.type === 'VEVENT');
  // Duplicate UIDs in one snapshot would be silently overwritten by the parser.
  if (events.length !== starts) throw new Error('Calendário contém eventos inválidos ou UIDs duplicados');
  const blocks = [];
  for (const event of events) {
    const uid = String(event.uid || '');
    if (uid.endsWith('@pousadarecanto') || String(event.status).toUpperCase() === 'CANCELLED') continue;
    if (!uid || !(event.start instanceof Date) || Number.isNaN(+event.start)) throw new Error('Evento iCal sem UID ou data válida');
    if (event.rrule || event.recurrences || event.recurrenceid) throw new Error('Eventos recorrentes iCal não são suportados');
    const civil = date => new Date(date.dateOnly ? Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) : date.toISOString().slice(0, 10));
    const start = civil(event.start);
    const end = event.end ? (event.datetype === 'date' ? new Date(Date.UTC(event.end.getFullYear(), event.end.getMonth(), event.end.getDate())) : civil(event.end)) : new Date(+start + 86400000);
    if (!Number.isFinite(+end) || end <= start || (+end - +start) / 86400000 > 3660) throw new Error('Período iCal inválido');
    const code = event['RESERVATION-ID'] || event['BOOKING-ID'] || String(event.description || '').match(/(?:reservation|booking|confirmation|reserva)\s*(?:id|code|number|código|#|:)\s*[:#]?\s*([\w-]+)/i)?.[1];
    for (let day = +start; day < +end; day += 86400000) blocks.push({ data: new Date(day), uidExterno: uid, ...(code ? { codigoExterno: String(code).trim() } : {}) });
    if (blocks.length > 50000) throw new Error('Calendário iCal excede limite de noites');
  }
  return blocks;
};
