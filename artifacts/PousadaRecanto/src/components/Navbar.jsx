import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#pousada", label: "A Pousada" },
  { href: "#estadias", label: "Estadias" },
  { href: "#comodidades", label: "Comodidades" },
  { href: "#galeria", label: "Galeria" },
  { href: "#localizacao", label: "Localização" },
];

export const LogoMark = ({ className = "h-9 w-9" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <rect width="64" height="64" rx="14" fill="#18221B" />
    <path
      d="M8 44 L24 24 L34 37 L42 28 L56 44"
      fill="none"
      stroke="#5C745D"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="44" cy="17" r="6" fill="#C86D51" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-hairline bg-sand/85 backdrop-blur-md"
            : "bg-transparent"
        }`}
        data-testid="navbar"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a
            href="#top"
            className="flex items-center gap-3"
            data-testid="nav-logo"
          >
            <LogoMark className="h-9 w-9" />
            <span
              className={`font-serif text-xl leading-none ${
                scrolled ? "text-ink" : "text-sand"
              }`}
            >
              Recanto <em className="italic">da Paz</em>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.href.slice(1)}`}
                className={`text-sm font-medium transition-colors hover:text-clay ${
                  scrolled ? "text-moss" : "text-sand/85"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#reservas"
              data-testid="nav-cta-reserve"
              className="rounded-full bg-clay px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-claydark hover:shadow-lift"
            >
              Reservar
            </a>
          </nav>

          <button
            className={`md:hidden ${scrolled ? "text-ink" : "text-sand"}`}
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            data-testid="nav-toggle"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-pine/[0.97] backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="nav-drawer"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-serif text-xl text-sand">
                Recanto <em className="italic">da Paz</em>
              </span>
              <button
                className="text-sand"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                data-testid="nav-close"
              >
                <X size={28} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8">
              {LINKS.concat({ href: "#reservas", label: "Reservar" }).map(
                (l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    data-testid={`drawer-link-${l.href.slice(1)}`}
                    className="font-serif text-4xl text-sand"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.5 }}
                  >
                    <em className="italic">{l.label}</em>
                  </motion.a>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
