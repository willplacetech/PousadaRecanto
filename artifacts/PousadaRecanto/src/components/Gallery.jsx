import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { GALLERY } from "../config";

export default function Gallery() {
  const [index, setIndex] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (index === null) return;
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % GALLERY.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  return (
    <section
      id="galeria"
      className="bg-linen/40 py-20 md:py-28"
      data-testid="gallery-section"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <Eyebrow>Galeria</Eyebrow>
          <h2
            className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] text-ink sm:text-5xl"
            data-testid="gallery-title"
          >
            Um <em className="italic text-clay">olhar</em> pelo recanto
          </h2>
        </Reveal>

        <div className="mt-12 columns-2 gap-4 md:columns-3">
          {GALLERY.map((img, i) => (
            <Reveal key={img.src} delay={0.04 * i} className="mb-4 break-inside-avoid">
              <button
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-xl shadow-soft"
                data-testid={`gallery-item-${i}`}
                aria-label={`Abrir foto: ${img.alt}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {img.official && (
                  <span className="absolute left-3 top-3 rounded-full bg-pine/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-sand">
                    Foto oficial
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-pine/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIndex(null)}
            data-testid="gallery-lightbox"
          >
            <button
              className="absolute right-5 top-5 text-sand"
              onClick={() => setIndex(null)}
              aria-label="Fechar"
              data-testid="lightbox-close"
            >
              <X size={30} />
            </button>
            <button
              className="absolute left-4 text-sand/80 hover:text-sand"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length);
              }}
              aria-label="Foto anterior"
              data-testid="lightbox-prev"
            >
              <ChevronLeft size={36} />
            </button>
            <motion.figure
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-5xl"
              data-testid="lightbox-figure"
            >
              <img
                src={GALLERY[index].src}
                alt={GALLERY[index].alt}
                className="max-h-[75vh] w-auto rounded-xl object-contain"
              />
              <figcaption className="mt-3 text-center text-sm text-sand/75">
                {GALLERY[index].alt} — {index + 1}/{GALLERY.length}
              </figcaption>
            </motion.figure>
            <button
              className="absolute right-4 text-sand/80 hover:text-sand"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((i) => (i + 1) % GALLERY.length);
              }}
              aria-label="Próxima foto"
              data-testid="lightbox-next"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
