import { useEffect, useState } from "react";
import {
  ArrowDown,
  Bath,
  Car,
  Clock,
  Coffee,
  ExternalLink,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  ShieldCheck,
  Tv,
  UtensilsCrossed,
  Wind,
  Wifi,
  X,
} from "lucide-react";
import { Toaster } from "sonner";
import { OTA, PHOTOS, POUSADA, STAYS, buildWhatsAppUrl, photo } from "@/data/pousada";
import { Gallery } from "./gallery";
import { Reservation } from "./reserve";
import { Eyebrow, LogoMark, Photo, Reveal } from "./ui";

const NAV = [
  { href: "#pousada", label: "A pousada" },
  { href: "#estadias", label: "Estadias" },
  { href: "#comodidades", label: "Comodidades" },
  { href: "#galeria", label: "Galeria" },
  { href: "#localizacao", label: "Como chegar" },
];

const MARQUEE = [
  "Piscina ao ar livre",
  "Serra de Lindóia",
  "Quartos com ar-condicionado",
  "Cozinha compartilhada",
  "Estacionamento na porta",
  "Café da manhã",
];

const AMENITIES = [
  { icon: Wifi, title: "Wi-Fi gratuito", sub: "nas áreas da casa" },
  { icon: Car, title: "Estacionamento", sub: "privativo, na frente" },
  { icon: Wind, title: "Ar-condicionado", sub: "nos quartos" },
  { icon: Tv, title: "TV e frigobar", sub: "em cada quarto" },
  { icon: Coffee, title: "Café da manhã", sub: "mesa posta na casa" },
  { icon: UtensilsCrossed, title: "Cozinha", sub: "fogão, micro-ondas, geladeira" },
  { icon: Bath, title: "Banheiro privativo", sub: "box de vidro" },
  { icon: ShieldCheck, title: "Casa fechada", sub: "portão e rua tranquila" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tone = scrolled || open ? "text-ink" : "text-sand";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-hairline bg-sand/92 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10">
        <a href="#topo" className="flex items-center gap-3">
          <LogoMark />
          <span className={`font-serif text-xl leading-none ${tone}`}>
            Recanto <em>da Paz</em>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-clay ${
                scrolled ? "text-moss" : "text-sand/90"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reservas"
            className="rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-card hover:bg-claydark"
          >
            Reservar
          </a>
        </nav>
        <button
          type="button"
          className={`flex h-11 w-11 items-center justify-center md:hidden ${tone}`}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-hairline px-5 py-4 md:hidden">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reservas"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-clay px-5 py-3 text-center text-sm font-semibold text-card"
          >
            Reservar estadia
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const hero = photo("/photos/pool-deck.jpg");
  const thumbs = [
    photo("/photos/room-garden.jpg"),
    photo("/photos/kitchen-porch.jpg"),
    photo("/photos/facade-hills.jpg"),
    photo("/photos/roses.jpg"),
  ];

  return (
    <section id="topo" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-pine">
      <img
        src={hero.src}
        alt={hero.alt}
        width={hero.w}
        height={hero.h}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pine/75 via-pine/25 to-pine/85" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-28 pb-8 md:px-10 md:pb-10">
        <Eyebrow light>Pousada · Lindóia, SP</Eyebrow>
        <h1 className="mt-3 font-serif text-6xl leading-[0.92] text-sand sm:text-7xl lg:text-8xl">
          Recanto
          <span className="block italic text-linen">da Paz</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-sand/90 md:text-lg">
          Piscina com deque de madeira, quartos claros e a serra no fundo do pátio.
          Uma casa simples, arrumada com cuidado, para dias mais lentos.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#reservas"
            className="rounded-full bg-clay px-7 py-3.5 text-center text-sm font-semibold text-card hover:bg-claydark"
          >
            Reservar estadia
          </a>
          <a
            href="#galeria"
            className="rounded-full border border-sand/40 px-7 py-3.5 text-center text-sm font-semibold text-sand hover:bg-sand/10"
          >
            Ver as {PHOTOS.length} fotos
          </a>
        </div>
        <div className="mt-8 flex gap-3 overflow-x-auto pb-1">
          {thumbs.map((item) => (
            <a
              key={item.src}
              href="#galeria"
              aria-label={item.alt}
              className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-sand/30"
            >
              <img src={item.src} alt="" className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      </div>
      <div className="relative z-10 border-t border-sand/15">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-3 px-5 py-4 pr-20 md:grid-cols-4 md:px-10 md:pr-10">
          {[
            ["Check-in", "a partir das 14h"],
            ["Check-out", "até 12h"],
            ["Lazer", "piscina ao ar livre"],
            ["Chegada", "estacionamento na porta"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-[0.18em] text-sand/60">{label}</p>
              <p className="text-sm font-medium text-sand">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <ArrowDown className="absolute right-6 bottom-28 hidden text-sand/70 md:block" size={22} />
    </section>
  );
}

function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-y border-hairline bg-card py-4">
      <div className="animate-marquee flex w-max">
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center font-serif text-xl italic text-ink/80 md:text-2xl">
            <span className="mx-7 whitespace-nowrap md:mx-10">{item}</span>
            <span className="text-clay">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  const main = photo("/photos/facade-hills.jpg");
  const pool = photo("/photos/pool-portrait.jpg");
  const linen = photo("/photos/room-linen.jpg");

  return (
    <section id="pousada" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <div className="grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>A pousada</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Telhado de barro, <em className="text-clay">serra atrás</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-6 leading-relaxed text-moss">
              A Recanto da Paz fica na Rua do Vento Bravo, em Lindóia, no Circuito das Águas
              Paulista. A casa é baixa, com pátio na frente, estacionamento marcado e o
              morro verde logo depois do muro.
            </p>
            <p className="mt-4 leading-relaxed text-moss">
              Por dentro, quartos brancos com cama arrumada, ar-condicionado, TV e frigobar.
              A cozinha é compartilhada — fogão, micro-ondas e mesas na varanda coberta para
              o café que se estica.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Check-in 14h", "Check-out 12h", "Rua tranquila"].map((pill) => (
                <span key={pill} className="rounded-full border border-hairline bg-card px-4 py-2 text-xs font-medium text-moss">
                  {pill}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <div className="overflow-hidden rounded-3xl shadow-lift">
              <Photo src={main.src} alt={main.alt} width={main.w} height={main.h} className="h-72 w-full object-cover md:h-[420px]" />
            </div>
          </Reveal>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-3xl shadow-soft">
                <Photo src={pool.src} alt={pool.alt} width={pool.w} height={pool.h} className="h-44 w-full object-cover md:h-56" />
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="overflow-hidden rounded-3xl shadow-soft">
                <Photo src={linen.src} alt={linen.alt} width={linen.w} height={linen.h} className="h-44 w-full object-cover md:h-56" />
              </div>
            </Reveal>
          </div>
          <p className="mt-3 text-right text-xs text-fog">Fotos da própria pousada</p>
        </div>
      </div>
    </section>
  );
}

function Stays() {
  return (
    <section id="estadias" className="bg-linen/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <Eyebrow>Estadias</Eyebrow>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Quartos claros, <em className="text-clay">cama feita</em>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STAYS.map((stay, index) => (
            <Reveal key={stay.id} delay={index * 70}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-card shadow-soft">
                <Photo
                  src={stay.photo.src}
                  alt={stay.photo.alt}
                  width={stay.photo.w}
                  height={stay.photo.h}
                  className="h-56 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl text-ink">{stay.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-moss">{stay.text}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {stay.points.map((point) => (
                      <li key={point} className="rounded-full bg-linen px-3 py-1 text-xs font-medium text-moss">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#reservas"
                    className="mt-6 inline-flex text-sm font-semibold text-clay hover:text-claydark"
                  >
                    Pedir esta estadia
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-5 grid overflow-hidden rounded-3xl bg-pine text-sand md:grid-cols-2">
            <Photo
              src="/photos/kitchen.jpg"
              alt="Cozinha compartilhada com fogão, micro-ondas e geladeira"
              width={1680}
              height={1118}
              className="h-64 w-full object-cover md:h-full"
            />
            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-linen">A Pousada</p>
              <h3 className="mt-3 font-serif text-3xl">Cozinha para o almoço de família</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand/75">
                Fogão, micro-ondas, geladeira e bancada branca. Ao lado, a varanda coberta
                com mesas — o lugar do café e da conversa comprida.
              </p>
              <a href="#galeria" className="mt-6 text-sm font-semibold text-linen underline-offset-4 hover:underline">
                Ver a cozinha e a varanda
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Amenities() {
  const pool = photo("/photos/pool-loungers.jpg");
  const dining = photo("/photos/dining-cover.jpg");
  const porch = photo("/photos/kitchen-porch.jpg");

  return (
    <section id="comodidades" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <Eyebrow>Comodidades</Eyebrow>
        <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
          O que a pousada <em className="text-clay">realmente tem</em>
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <figure className="relative h-80 overflow-hidden rounded-3xl md:h-full md:min-h-[420px]">
            <Photo
              src={pool.src}
              alt={pool.alt}
              width={pool.w}
              height={pool.h}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine/80 to-transparent p-6">
              <p className="font-serif text-3xl text-sand">Piscina ao ar livre</p>
              <p className="mt-1 text-sm text-sand/75">Deque, espreguiçadeiras e guarda-sóis no jardim</p>
            </figcaption>
          </figure>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:col-span-5">
          {AMENITIES.slice(0, 4).map((item) => (
            <Reveal key={item.title}>
              <div className="flex h-full min-h-36 flex-col justify-end rounded-3xl border border-hairline bg-card p-5 shadow-soft">
                <item.icon className="text-sage" size={22} />
                <p className="mt-3 text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-fog">{item.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="md:col-span-5">
          <figure className="relative h-64 overflow-hidden rounded-3xl md:h-full md:min-h-64">
            <Photo
              src={porch.src}
              alt={porch.alt}
              width={porch.w}
              height={porch.h}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-sand/90 px-3 py-1 text-xs font-semibold text-ink">
              Varanda da cozinha
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="md:col-span-7">
          <figure className="relative h-64 overflow-hidden rounded-3xl">
            <Photo
              src={dining.src}
              alt={dining.alt}
              width={dining.w}
              height={dining.h}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine/75 to-transparent p-5 font-serif text-2xl text-sand">
              Refeições na área coberta
            </figcaption>
          </figure>
        </Reveal>
        {AMENITIES.slice(4).map((item) => (
          <Reveal key={item.title} className="md:col-span-3">
            <div className="flex h-full min-h-36 flex-col justify-end rounded-3xl border border-hairline bg-card p-5 shadow-soft">
              <item.icon className="text-sage" size={22} />
              <p className="mt-3 text-sm font-semibold text-ink">{item.title}</p>
              <p className="text-xs text-fog">{item.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Location() {
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${POUSADA.coords.lat},${POUSADA.coords.lng}`;
  const embed = `https://maps.google.com/maps?q=${POUSADA.coords.lat},${POUSADA.coords.lng}&z=16&output=embed`;
  const street = photo("/photos/arrival.jpg");

  return (
    <section id="localizacao" className="bg-card py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-12 md:px-10">
        <div>
          <Reveal>
            <Eyebrow>Como chegar</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              No fim de uma <em className="text-clay">rua quieta</em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 overflow-hidden rounded-3xl">
              <Photo src={street.src} alt={street.alt} width={street.w} height={street.h} className="h-52 w-full object-cover" />
            </div>
            <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-moss">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-sage" size={18} />
                {POUSADA.address}
                <span className="sr-only">{POUSADA.cep}</span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="mt-0.5 shrink-0 text-sage" size={18} />
                Check-in a partir das {POUSADA.checkin} · check-out {POUSADA.checkout}
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={dir}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-sand hover:bg-clay"
              >
                <Navigation size={15} /> Traçar rota
              </a>
              <a
                href={POUSADA.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-6 py-3.5 text-sm font-semibold text-ink hover:border-clay hover:text-clay"
              >
                Google Maps <ExternalLink size={15} />
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="overflow-hidden rounded-3xl border border-hairline shadow-lift">
            <iframe
              title="Mapa da Pousada Recanto da Paz em Lindóia"
              src={embed}
              className="h-80 w-full md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-pine text-sand">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-10">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <p className="font-serif text-2xl">
              Recanto <em className="text-linen">da Paz</em>
            </p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/70">
            Pousada em Lindóia — piscina, jardim e o silêncio de uma rua sem pressa.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sand/50">Contato</p>
          <p className="mt-4 text-sm text-sand/85">{POUSADA.address}</p>
          <p className="mt-1 text-sm text-sand/70">CEP {POUSADA.cep}</p>
          <a
            href={buildWhatsAppUrl("Olá! Vim pelo site da Pousada Recanto da Paz e gostaria de mais informações.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-card hover:bg-claydark"
          >
            <MessageCircle size={16} /> Falar com a pousada
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sand/50">Também em</p>
          <div className="mt-4 flex flex-col items-start gap-2 text-sm text-sand/85">
            <a href={OTA.booking} target="_blank" rel="noopener noreferrer" className="hover:text-linen">
              Booking.com
            </a>
            <a href={OTA.airbnb} target="_blank" rel="noopener noreferrer" className="hover:text-linen">
              Airbnb
            </a>
            <a href="#reservas" className="hover:text-linen">
              Reserva direta, sem taxa
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-sand/10 px-5 py-5 text-center text-xs text-sand/50 md:px-10">
        © {year} Pousada Recanto da Paz · Lindóia, SP
      </div>
    </footer>
  );
}

export function Home() {
  return (
    <main className="bg-sand text-ink">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Stays />
      <Amenities />
      <Gallery />
      <Reservation />
      <Location />
      <Footer />
      <a
        href={buildWhatsAppUrl("Olá! Vim pelo site da Pousada Recanto da Paz e gostaria de fazer uma reserva.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-clay text-card shadow-lift hover:bg-claydark"
      >
        <MessageCircle size={26} />
      </a>
      <Toaster position="top-center" />
    </main>
  );
}
