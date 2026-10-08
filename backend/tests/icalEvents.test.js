import { describe, it, expect } from 'vitest';
import { parseCalendar, publicAddress, validateCalendarUrl } from '../src/services/icalEvents.js';
import { execFileSync } from 'node:child_process';

const calendar = (events = '') => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${events}END:VCALENDAR\r\n`;
const event = (extra = '') => `BEGIN:VEVENT\r\nUID:ota-1\r\nDTSTART;VALUE=DATE:20261010\r\nDTEND;VALUE=DATE:20261012\r\nSUMMARY:BLOCKED\r\n${extra}END:VEVENT\r\n`;
describe('iCal civil nights and safe snapshots', () => {
  it('includes external blocked events and excludes checkout', () => {
    expect(parseCalendar(calendar(event())).map(b => b.data.toISOString())).toEqual(['2026-10-10T00:00:00.000Z', '2026-10-11T00:00:00.000Z']);
  });
  it('keeps all-day civil dates when server timezone is Sao Paulo', () => {
    const source = `import {parseCalendar} from './src/services/icalEvents.js'; process.stdout.write(JSON.stringify(parseCalendar(${JSON.stringify(calendar(event()))}).map(b=>b.data.toISOString())));`;
    const result = execFileSync(process.execPath, ['--input-type=module','-e',source], { encoding: 'utf8', env: { ...process.env, TZ:'America/Sao_Paulo' } });
    expect(JSON.parse(result)).toEqual(['2026-10-10T00:00:00.000Z', '2026-10-11T00:00:00.000Z']);
  });
  it('keeps event identity for two events on the same night', () => {
    const blocks = parseCalendar(calendar(event() + event().replace('ota-1', 'ota-2')));
    expect(new Set(blocks.map(b => b.uidExterno)).size).toBe(2);
  });
  it('ignores cancelled and self exported events', () => {
    expect(parseCalendar(calendar(event('STATUS:CANCELLED\r\n') + event().replace('ota-1', 'night-x@pousadarecanto')))).toEqual([]);
  });
  it('accepts an empty valid calendar but rejects broken downloads and recurrence', () => {
    expect(parseCalendar(calendar())).toEqual([]);
    for (const body of ['<html>error</html>', calendar(event()).replace('END:VEVENT', ''), calendar(event('RRULE:FREQ=DAILY\r\n')), calendar(event()).replace('20261012', '20261009')]) {
      expect(() => parseCalendar(body)).toThrow();
    }
  });
  it('recognizes explicit external booking codes', () => {
    expect(parseCalendar(calendar(event('X-RESERVATION-ID:ABC42\r\n')))[0].codigoExterno).toBe('ABC42');
  });
});
describe('download network boundary', () => {
  it('rejects credentials and protocols other than HTTP(S)', () => {
    for (const url of ['file:///etc/passwd', 'ftp://example.com/a', 'https://user:pass@example.com/a']) expect(() => validateCalendarUrl(url)).toThrow();
  });
  it('rejects private, mapped, loopback and reserved network addresses', () => {
    for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', 'fc00::1', 'fe80::1', '::ffff:127.0.0.1', '2001:db8::1']) expect(publicAddress(ip), ip).toBe(false);
    expect(publicAddress('8.8.8.8')).toBe(true);
    expect(publicAddress('2606:4700:4700::1111')).toBe(true);
  });
});
