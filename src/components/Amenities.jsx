import {
  Wifi,
  Car,
  Flower2,
  Flame,
  Wind,
  Tv,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";

const tiles = [
  { icon: Wifi, title: "Wi-Fi gratuito", sub: "em todas as áreas" },
  { icon: Car, title: "Estacionamento", sub: "privativo e seguro" },
  { icon: Flower2, title: "Jardim & terraço", sub: "ensolarado" },
  {
    icon: Flame,
    title: "Refeições ao ar livre",
    sub: "área exclusiva & churrasqueira",
    wide: true,
  },
  { icon: Wind, title: "Ar-condicionado", sub: "nas acomodações" },
  { icon: Tv, title: "Sala de lazer", sub: "espaço de convivência / TV" },
  {
    icon: ShieldCheck,
    title: "Segurança 24h",
    sub: "& recepção dedicada",
    wide: true,
  },
  { icon: Waves, title: "Piscina para crianças", sub: "diversão garantida" },
];

export default function Amenities() {
  return (
    <section
      id="comodidades"
      className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
      data-testid="amenities-section"
    >
      <Reveal>
        <Eyebrow>Comodidades</Eyebrow>
        <h2
          className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] text-ink sm:text-5xl"
          data-testid="amenities-title"
        >
          Tudo para <em className="italic text-clay">descansar</em> de verdade
        </h2>
      </Reveal>

      <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-4 md:grid-cols-4">
        <Reveal className="col-span-2 row-span-2 h-full">
          <div
            className="group relative h-full w-full overflow-hidden rounded-2xl"
            data-testid="amenity-photo-pool"
          >
            <img
              src="/photos/gmap_5.jpg"
              alt="Entrada do salão de café da manhã e recepção"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pine/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="font-serif text-xl text-sand">
                Café da manhã & recepção
              </p>
              <p className="text-xs text-sand/75">
                salão próprio e recepção dedicada — foto oficial
              </p>
            </div>
          </div>
        </Reveal>

        {tiles.map((t, i) => (
          <Reveal
            key={t.title}
            delay={0.05 * i}
            className={`h-full ${t.wide ? "col-span-2" : ""}`}
          >
            <div
              className="flex h-full flex-col justify-center gap-1 rounded-2xl border border-hairline bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              data-testid={`amenity-tile-${i}`}
            >
              <t.icon size={22} className="text-sage" />
              <p className="mt-2 text-sm font-semibold text-ink">{t.title}</p>
              <p className="text-xs text-fog">{t.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
