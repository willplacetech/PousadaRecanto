import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HERO_IMG, POUSADA } from "../config";
import { ease, Eyebrow } from "./Reveal";

const strip = [
  { label: "Check-in", value: "14h" },
  { label: "Check-out", value: "até 12h" },
  { label: "Lazer", value: "piscina ao ar livre" },
  { label: "Conforto", value: "wi-fi & estacionamento" },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-pine"
      data-testid="hero"
    >
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={HERO_IMG}
          alt="Piscina ao ar livre da Pousada Recanto da Paz em Lindoia"
          className="h-full w-full object-cover"
          data-testid="hero-photo"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine/70 via-pine/35 to-pine/85" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pt-28 md:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <Eyebrow light>Pousada · Lindoia, SP</Eyebrow>
        </motion.div>

        <h1
          className="mt-4 font-serif text-[17vw] leading-[0.95] text-sand sm:text-7xl md:text-8xl lg:text-[7.5rem]"
          data-testid="hero-title"
        >
          {[
            { text: "Recanto", italic: false },
            { text: "da Paz", italic: true },
          ].map((line, i) => (
            <span key={i} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${line.italic ? "italic text-linen" : ""}`}
                initial={{ y: "112%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease, delay: 0.25 + i * 0.14 }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-sand/85 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.7 }}
          data-testid="hero-subline"
        >
          O sossego da serra em Lindoia — piscina ao ar livre, jardim ensolarado
          e aquela paz que só o interior oferece.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.85 }}
        >
          <a
            href="#reservas"
            data-testid="hero-cta-reserve"
            className="rounded-full bg-clay px-8 py-4 text-center text-sm font-semibold text-white transition-all hover:bg-claydark hover:shadow-lift"
          >
            Reservar estadia
          </a>
          <a
            href="#pousada"
            data-testid="hero-cta-about"
            className="rounded-full border border-sand/45 px-8 py-4 text-center text-sm font-semibold text-sand transition-all hover:bg-sand/10"
          >
            Conhecer a pousada
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 border-t border-sand/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-3 px-5 py-5 md:grid-cols-4 md:px-10">
          {strip.map((s) => (
            <div key={s.label} data-testid="hero-strip-item">
              <p className="text-[10px] uppercase tracking-[0.22em] text-sand/60">
                {s.label}
              </p>
              <p className="text-sm font-medium text-sand/90">{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-6 z-10 hidden md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      >
        <ArrowDown className="text-sand/60" size={22} />
      </motion.div>
    </section>
  );
}
