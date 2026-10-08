import { Reveal, Eyebrow } from "./Reveal";
import { GALLERY } from "../config";

export default function About() {
  return (
    <section
      id="pousada"
      className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
      data-testid="about-section"
    >
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>A Pousada</Eyebrow>
            <h2
              className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl"
              data-testid="about-title"
            >
              O sossego que a <em className="italic text-clay">serra</em> guarda
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="mt-7 leading-relaxed text-moss"
              data-testid="about-text-1"
            >
              A Pousada Recanto da Paz fica em Lindoia, no Circuito das Águas
              Paulista — um convite a dias mais lentos. Aqui o dia começa com o
              canto dos pássaros, tem piscina ao ar livre, jardim e terraço
              ensolarado para recarregar as energias.
            </p>
            <p className="mt-5 leading-relaxed text-moss" data-testid="about-text-2">
              Suítes com ar-condicionado, Wi-Fi gratuito, estacionamento
              privativo e área de refeições ao ar livre com churrasqueira para
              aqueles almoços que se esticam até o fim da tarde.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Check-in 14h", "Check-out até 12h", "Segurança 24h"].map(
                (pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-hairline bg-card px-4 py-2 text-xs font-medium text-moss"
                  >
                    {pill}
                  </span>
                )
              )}
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl shadow-lift">
              <img
                src={GALLERY[5].src}
                alt={GALLERY[5].alt}
                className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[420px]"
                data-testid="about-img-main"
              />
            </div>
          </Reveal>
          <Reveal delay={0.25} className="mt-5 grid grid-cols-2 gap-5">
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <img
                src="/photos/gmap_1.jpg"
                alt="Piscina da pousada — foto oficial do Google Maps"
                className="h-[160px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[220px]"
                data-testid="about-img-pool"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <img
                src={GALLERY[3].src}
                alt={GALLERY[3].alt}
                className="h-[160px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[220px]"
                data-testid="about-img-serra"
              />
            </div>
          </Reveal>
          <p className="mt-3 text-right text-[11px] text-fog">
            Fotos oficiais da pousada (Google Maps)
          </p>
        </div>
      </div>
    </section>
  );
}
