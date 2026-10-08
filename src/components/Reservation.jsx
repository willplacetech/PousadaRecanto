import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MessageCircle, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { buildWhatsAppUrl, OTA, POUSADA } from "../config";

const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const API = backendUrl ? `${backendUrl}/api` : "";

const STEPS = [
  "Preencha seus dados ao lado",
  API ? "Sua reserva é registrada na pousada" : "Confira os dados da sua solicitação",
  "O WhatsApp abre com tudo preenchido — é só enviar",
];

const initialForm = {
  name: "",
  phone: "",
  stay_type: "Suíte — casal",
  checkin: "",
  checkout: "",
  guests: "2",
  notes: "",
};

const fmt = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export default function Reservation() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 3) err.name = "Informe seu nome completo.";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13)
      err.phone = "DDD + número, ex: (19) 99999-9999.";
    if (!form.checkin) err.checkin = "Escolha a data de check-in.";
    else if (form.checkin < today) err.checkin = "O check-in deve ser hoje ou em uma data futura.";
    if (!form.checkout) err.checkout = "Escolha a data de check-out.";
    if (form.checkin && form.checkout && form.checkout <= form.checkin)
      err.checkout = "O check-out deve ser após o check-in.";
    return err;
  };

  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    setSending(true);
    try {
      if (API) {
        await axios.post(`${API}/reservations`, {
          ...form,
          guests: Number(form.guests),
        });
      }
      const msg = [
        "Olá! Gostaria de fazer uma reserva na Pousada Recanto da Paz.",
        "",
        `• Nome: ${form.name}`,
        `• Telefone: ${form.phone}`,
        `• Estadia: ${form.stay_type}`,
        `• Check-in: ${fmt(form.checkin)}`,
        `• Check-out: ${fmt(form.checkout)}`,
        `• Hóspedes: ${form.guests}`,
        form.notes ? `• Observações: ${form.notes}` : "",
        "",
        "Enviado pelo site da pousada.",
      ]
        .filter(Boolean)
        .join("\n");

      toast.success(API
        ? "Reserva registrada! Confirme no WhatsApp que abrirá agora."
        : "Solicitação pronta! Envie a mensagem pelo WhatsApp para confirmar.");
      setForm(initialForm);
      window.open(buildWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
    } catch (ex) {
      const detail = ex?.response?.data?.detail;
      toast.error(detail || "Não foi possível registrar a reserva. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const field =
    "w-full rounded-xl border border-hairline bg-sand px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-fog focus:border-clay focus:ring-2 focus:ring-clay/20";

  return (
    <section
      id="reservas"
      className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
      data-testid="reservation-section"
    >
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>Reservas</Eyebrow>
            <h2
              className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl"
              data-testid="reservation-title"
            >
              Garanta a sua <em className="italic text-clay">estadia</em>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-moss">
              Reserve diretamente com a pousada, sem taxas de intermediação.
              Confirmação rápida pelo WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ol className="mt-9 flex flex-col gap-5">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-card font-serif text-lg text-clay">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-sm leading-relaxed text-moss">{s}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 flex items-center gap-2 text-xs text-fog">
              <CalendarCheck size={14} />
              Check-in a partir de 14h · Check-out até 12h
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl border border-hairline bg-card p-6 shadow-lift md:p-8"
            data-testid="reservation-form"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-moss" htmlFor="f-name">
                  Nome
                </label>
                <input
                  id="f-name"
                  className={field}
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={set("name")}
                  data-testid="form-input-name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-clay" data-testid="form-error-name">{errors.name}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-moss" htmlFor="f-phone">
                  WhatsApp / Telefone
                </label>
                <input
                  id="f-phone"
                  type="tel"
                  className={field}
                  placeholder="(19) 99999-9999"
                  value={form.phone}
                  onChange={set("phone")}
                  data-testid="form-input-phone"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-clay" data-testid="form-error-phone">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-moss" htmlFor="f-checkin">
                  Check-in
                </label>
                <input
                  id="f-checkin"
                  type="date"
                  min={today}
                  className={field}
                  value={form.checkin}
                  onChange={set("checkin")}
                  data-testid="form-input-checkin"
                />
                {errors.checkin && (
                  <p className="mt-1 text-xs text-clay" data-testid="form-error-checkin">{errors.checkin}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-moss" htmlFor="f-checkout">
                  Check-out
                </label>
                <input
                  id="f-checkout"
                  type="date"
                  min={form.checkin || today}
                  className={field}
                  value={form.checkout}
                  onChange={set("checkout")}
                  data-testid="form-input-checkout"
                />
                {errors.checkout && (
                  <p className="mt-1 text-xs text-clay" data-testid="form-error-checkout">{errors.checkout}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-moss" htmlFor="f-stay">
                  Estadia
                </label>
                <select
                  id="f-stay"
                  className={field}
                  value={form.stay_type}
                  onChange={set("stay_type")}
                  data-testid="form-select-stay"
                >
                  <option>Suíte — casal</option>
                  <option>Suíte — família</option>
                  <option>Estadia em grupo</option>
                  <option>Ainda não sei</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-moss" htmlFor="f-guests">
                  Hóspedes
                </label>
                <select
                  id="f-guests"
                  className={field}
                  value={form.guests}
                  onChange={set("guests")}
                  data-testid="form-select-guests"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "hóspede" : "hóspedes"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-moss" htmlFor="f-notes">
                  Observações
                </label>
                <textarea
                  id="f-notes"
                  rows={3}
                  className={`${field} resize-none`}
                  placeholder="Chegada prevista, berço, preferências..."
                  value={form.notes}
                  onChange={set("notes")}
                  data-testid="form-input-notes"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-claydark hover:shadow-lift disabled:opacity-60"
              data-testid="form-submit-button"
            >
              {sending ? (
                "Registrando..."
              ) : (
                <>
                  <MessageCircle size={17} /> Enviar e confirmar no WhatsApp
                </>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-fog">
              {API
                ? "Ao enviar, seus dados ficam registrados com a pousada e o WhatsApp abre com a mensagem pronta. "
                : "Ao enviar, o WhatsApp abre com a sua solicitação pronta. A reserva será confirmada pela pousada. "}
              {POUSADA.whatsappNumber
                ? "A mensagem é enviada para o número oficial."
                : "Escolha o contato da pousada no WhatsApp."}
            </p>
          </form>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div
          className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-hairline bg-card p-6 shadow-soft sm:flex-row md:px-10"
          data-testid="ota-block"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="shrink-0 text-sage" />
            <p className="max-w-sm text-sm leading-relaxed text-moss">
              Prefere reservar pelas plataformas? Também estamos no Airbnb e no
              Booking.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={OTA.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="ota-airbnb"
              className="rounded-full border border-hairline px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:border-clay hover:text-clay"
            >
              Airbnb
            </a>
            <a
              href={OTA.booking}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="ota-booking"
              className="rounded-full border border-hairline px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:border-clay hover:text-clay"
            >
              Booking.com
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
