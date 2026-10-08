export const normalizarDia = value => {
  const iso = value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
  const dia = new Date(`${iso}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || !Number.isFinite(dia.getTime()) || dia.toISOString().slice(0, 10) !== iso) throw new Error('Data inválida');
  return dia;
};
export const gerarDatasPeriodo = (checkin, checkout) => {
  const inicio = normalizarDia(checkin), fim = normalizarDia(checkout);
  if (fim <= inicio || (fim - inicio) / 86400000 > 366) throw new Error('Período inválido: checkout deve ser posterior ao checkin (máximo 366 noites)');
  const datas = [];
  for (let d = inicio.getTime(); d < fim.getTime(); d += 86400000) datas.push(new Date(d));
  return datas;
};
export const hojeSaoPaulo = () => {
  const partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const p = Object.fromEntries(partes.map(({ type, value }) => [type, value]));
  return normalizarDia(`${p.year}-${p.month}-${p.day}`);
};
