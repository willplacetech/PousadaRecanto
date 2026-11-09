import { MapPin, Navigation, ExternalLink, Clock } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { POUSADA } from "../config";

export default function LocationSection() {
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${POUSADA.coords.lat},${POUSADA.coords.lng}`;
  const embedUrl = `https://maps.google.com/maps?q=${POUSADA.coords.lat},${POUSADA.coords.lng}&z=16&output=embed`;

  return (
    <section
      id="localizacao"
      className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
      data-testid="location-section"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Reveal>
            <Eyebrow>Localização</Eyebrow>
            <h2
              className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl"
              data-testid="location-title"
            >
              No coração de <em className="italic text-clay">Lindoia</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col gap-5">
              <p className="flex items-start gap-3 text-sm leading-relaxed text-moss">
                <MapPin size={18} className="mt-0.5 shrink-0 text-sage" />
                {POUSADA.address}
              </p>
              <p className="flex items-start gap-3 text-sm leading-relaxed text-moss">
                <Clock size={18} className="mt-0.5 shrink-0 text-sage" />
                Check-in a partir das 14h · Check-out até as 12h
              </p>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={dirUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="location-directions"
                className="flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-clay"
              >
                <Navigation size={15} /> Traçar rota
              </a>
              <a
                href={POUSADA.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="location-maps-link"
                className="flex items-center justify-center gap-2 rounded-full border border-hairline px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:border-clay hover:text-clay"
              >
                Ver no Google Maps <ExternalLink size={15} />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-2xl border border-hairline shadow-lift">
            <iframe
              title="Mapa — Pousada Recanto da Paz, Lindoia SP"
              src={embedUrl}
              className="h-[320px] w-full md:h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="location-map"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
