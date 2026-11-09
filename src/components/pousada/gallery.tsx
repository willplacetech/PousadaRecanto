import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ALBUMS, PHOTOS, type Album } from "@/data/pousada";
import { Eyebrow, Reveal } from "./ui";

export function Gallery() {
  const [album, setAlbum] = useState<"todas" | Album>("quartos");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const dragged = useRef(false);
  const items =
    album === "todas" ? PHOTOS : PHOTOS.filter((photo) => photo.album === album);
  const current = items[index] ?? items[0];

  const go = (step: number) => {
    setIndex((value) => (value + step + items.length) % items.length);
  };

  useEffect(() => {
    if (paused || open || items.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = window.setInterval(() => go(1), 5500);
    return () => window.clearInterval(timer);
  }, [paused, open, items.length, album]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, items.length]);

  if (!current) return null;

  return (
    <section id="galeria" className="bg-linen/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <Eyebrow>Galeria</Eyebrow>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
              A Pousada, <em className="text-clay">quarto por quarto</em>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-moss">
              {items.length} {items.length === 1 ? "fotografia" : "fotografias"} — deslize para ver
              cada acomodação, a piscina e o resto da pousada.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {ALBUMS.map((item) => {
            const active = album === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setAlbum(item.id);
                  setIndex(0);
                  setOpen(false);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-pine text-sand" : "bg-card text-moss hover:text-ink"
                }`}
                aria-pressed={active}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          className="relative mt-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            className="relative overflow-hidden rounded-3xl bg-pine shadow-lift"
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.currentTarget.dataset.x = String(event.clientX);
            }}
            onPointerUp={(event) => {
              const start = Number(event.currentTarget.dataset.x);
              delete event.currentTarget.dataset.x;
              if (!Number.isFinite(start)) return;
              const delta = event.clientX - start;
              if (Math.abs(delta) > 48) {
                dragged.current = true;
                go(delta > 0 ? -1 : 1);
              }
            }}
          >
            <button
              type="button"
              className="block w-full"
              onClick={() => {
                if (dragged.current) {
                  dragged.current = false;
                  return;
                }
                setOpen(true);
              }}
              aria-label={`Ampliar: ${current.alt}`}
            >
              <img
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.w}
                height={current.h}
                className="h-[52vh] min-h-72 w-full object-cover md:h-[560px]"
              />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine/80 to-transparent p-5 pr-28 md:p-7">
              <p className="font-serif text-2xl text-sand md:text-3xl">{current.alt}</p>
              <p className="mt-1 text-sm text-sand/75">
                {index + 1} / {items.length}
              </p>
            </div>
            <div className="absolute right-4 bottom-4 flex gap-2">
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => go(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-ink shadow-soft"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => go(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-ink shadow-soft"
                aria-label="Próxima foto"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {items.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={img.alt}
                aria-current={i === index}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-linen ${
                  i === index ? "ring-clay" : "ring-transparent"
                }`}
              >
                <img src={img.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-pine/95 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
        >
          <button
            type="button"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-sand"
            onClick={() => setOpen(false)}
            aria-label="Fechar"
          >
            <X size={28} />
          </button>
          <button
            type="button"
            className="absolute left-2 flex h-11 w-11 items-center justify-center text-sand md:left-5"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={34} />
          </button>
          <figure onClick={(event) => event.stopPropagation()} className="max-h-[88vh] max-w-5xl">
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[74vh] w-auto max-w-full rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-sand/80">
              {current.alt} — {index + 1}/{items.length}
            </figcaption>
          </figure>
          <button
            type="button"
            className="absolute right-2 flex h-11 w-11 items-center justify-center text-sand md:right-5"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            aria-label="Próxima foto"
          >
            <ChevronRight size={34} />
          </button>
        </div>
      )}
    </section>
  );
}
