import { Wifi, Wind, Waves, Tv, Flame, BedDouble, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { GALLERY } from "../config";

const outdoorAmenities = [
  { icon: Waves, label: "Piscina para crianças" },
  { icon: Tv, label: "Sala de lazer / TV" },
  { icon: Flame, label: "Churrasqueira" },
];

const suiteAmenities = [
  { icon: Wind, label: "Ar-condicionado" },
  { icon: Wifi, label: "Wi-Fi gratuito" },
  { icon: BedDouble, label: "Serviço de quartos" },
];

export default function Stays() {
  return (
    <section
      id="estadias"
      className="bg-linen/40 py-20 md:py-28"
      data-testid="stays-section"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <Eyebrow>Estadias</Eyebrow>
          <h2
            className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] text-ink sm:text-5xl"
            data-testid="stays-title"
          >
            Acomodações para <em className="italic text-clay">casais</em> e
            famílias
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.1}>
            <article
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-soft"
              data-testid="stay-card-suite"
            >
              <div className="overflow-hidden">
                <img
                  src={GALLERY[2].src}
                  alt={GALLERY[2].alt}
                  className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
                  data-testid="stay-suite-img"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-serif text-2xl text-ink" data-testid="stay-suite-name">
                  Viva ao ar livre
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-moss">
                  Deck de madeira com pergolado, redes à sombra e varandas para
                  o café da tarde — o melhor da pousada acontece fora do quarto.
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {outdoorAmenities.map((a) => (
                    <li
                      key={a.label}
                      className="flex items-center gap-2 text-xs font-medium text-moss"
                    >
                      <a.icon size={15} className="text-sage" />
                      {a.label}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between pt-7">
                  <span className="text-xs text-fog">
                    Consulte valores e disponibilidade
                  </span>
                  <a
                    href="#reservas"
                    data-testid="stay-suite-cta"
                    className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-sand transition-colors hover:bg-clay"
                  >
                    Reservar estadia <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.2}>
            <article
              className="flex h-full flex-col justify-between rounded-2xl border border-hairline bg-pine p-7 text-sand shadow-soft"
              data-testid="stay-card-family"
            >
              <div>
                <h3 className="font-serif text-2xl" data-testid="stay-family-name">
                  Suítes para casais e famílias
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/75">
                  Ar-condicionado, Wi-Fi e serviço de quartos — o conforto
                  necessário para descansar depois do dia na serra.
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {suiteAmenities.map((a) => (
                    <li
                      key={a.label}
                      className="flex items-center gap-3 text-sm text-sand/85"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand/10">
                        <a.icon size={15} className="text-linen" />
                      </span>
                      {a.label}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#reservas"
                data-testid="stay-family-cta"
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-clay px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-claydark"
              >
                Consultar disponibilidade <ArrowRight size={15} />
              </a>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
