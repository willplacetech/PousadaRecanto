import { useState, type FormEvent } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { buildWhatsAppUrl, STAYS } from "@/data/pousada";
import { Eyebrow, Photo, Reveal } from "./ui";

type Fields = {
  name: string;
  phone: string;
  stay: string;
  checkin: string;
  checkout: string;
  guests: string;
  notes: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  stay: STAYS[0].id,
  checkin: "",
  checkout: "",
  guests: "2",
  notes: "",
};

const fieldClass =
  "w-full rounded-xl border border-hairline bg-sand px-4 py-3 text-sm text-ink outline-none transition placeholder:text-fog focus:border-clay";

function fmt(iso: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function Reservation() {
  const [form, setForm] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  const side = STAYS[0].photo;

  const set =
    (key: keyof Fields) =>
    (event: { target: { value: string } }) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof Fields, string>> = {};
    if (form.name.trim().length < 3) next.name = "Informe seu nome completo.";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      next.phone = "DDD + número, ex: (19) 99999-9999.";
    }
    if (!form.checkin) next.checkin = "Escolha o check-in.";
    if (!form.checkout) next.checkout = "Escolha o check-out.";
    if (form.checkin && form.checkout && form.checkout <= form.checkin) {
      next.checkout = "O check-out precisa ser depois do check-in.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    const message = [
      "Olá! Gostaria de reservar na Pousada Recanto da Paz.",
      "",
      `• Nome: ${form.name.trim()}`,
      `• Telefone: ${form.phone.trim()}`,
      `• Estadia: ${form.stay}`,
      `• Check-in: ${fmt(form.checkin)}`,
      `• Check-out: ${fmt(form.checkout)}`,
      `• Hóspedes: ${form.guests}`,
      form.notes.trim() ? `• Observações: ${form.notes.trim()}` : "",
      "",
      "Enviado pelo site da pousada.",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSent(true);
    setForm(empty);
    toast.success("Mensagem pronta no WhatsApp. É só enviar para a pousada.");
  };

  return (
    <section id="reservas" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <div className="relative h-full min-h-80 overflow-hidden rounded-3xl">
            <Photo
              src={side.src}
              alt={side.alt}
              width={side.w}
              height={side.h}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-pine/10 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-6 text-sand">
              <p className="font-serif text-3xl">Reserve direto</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-sand/80">
                Sem taxa de plataforma. A pousada confirma datas e valor pelo WhatsApp.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-7">
          <Eyebrow>Reservas</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Diga as datas. <em className="text-clay">A gente responde.</em>
          </h2>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2" noValidate>
            <label className="block text-sm sm:col-span-1">
              <span className="mb-1.5 block font-medium text-ink">Nome</span>
              <input
                className={fieldClass}
                value={form.name}
                onChange={set("name")}
                autoComplete="name"
                placeholder="Seu nome"
              />
              {errors.name && <span className="mt-1 block text-xs text-claydark">{errors.name}</span>}
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">WhatsApp</span>
              <input
                className={fieldClass}
                value={form.phone}
                onChange={set("phone")}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(19) 99999-9999"
              />
              {errors.phone && <span className="mt-1 block text-xs text-claydark">{errors.phone}</span>}
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium text-ink">Estadia</span>
              <select className={fieldClass} value={form.stay} onChange={set("stay")}>
                {STAYS.map((stay) => (
                  <option key={stay.id}>{stay.id}</option>
                ))}
                <option>Ainda não sei — quero uma sugestão</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Check-in</span>
              <input className={fieldClass} type="date" value={form.checkin} onChange={set("checkin")} />
              {errors.checkin && (
                <span className="mt-1 block text-xs text-claydark">{errors.checkin}</span>
              )}
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Check-out</span>
              <input className={fieldClass} type="date" value={form.checkout} onChange={set("checkout")} />
              {errors.checkout && (
                <span className="mt-1 block text-xs text-claydark">{errors.checkout}</span>
              )}
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Hóspedes</span>
              <select className={fieldClass} value={form.guests} onChange={set("guests")}>
                {["1", "2", "3", "4", "5", "6+"].map((count) => (
                  <option key={count}>{count}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium text-ink">Observações</span>
              <textarea
                className={`${fieldClass} min-h-24 resize-y`}
                value={form.notes}
                onChange={set("notes")}
                placeholder="Crianças, horários, pedido especial"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-card transition-colors hover:bg-claydark"
              >
                <MessageCircle size={16} />
                Enviar pedido no WhatsApp
                <ArrowRight size={16} />
              </button>
              {sent && (
                <p className="mt-3 text-sm text-moss">
                  Se o WhatsApp não abriu, permita pop-ups e tente de novo.
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
