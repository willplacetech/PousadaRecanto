import { MessageCircle } from "lucide-react";
import { LogoMark } from "./Navbar";
import { Reveal } from "./Reveal";
import { buildWhatsAppUrl, OTA, POUSADA } from "../config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pine text-sand" data-testid="footer">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <LogoMark className="h-10 w-10" />
                <p className="font-serif text-2xl">
                  Recanto <em className="italic text-linen">da Paz</em>
                </p>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/65">
                Pousada em Lindoia, SP — piscina ao ar livre, jardim e o
                silêncio da serra para recarregar as energias.
              </p>
            </div>

            <div data-testid="footer-contact">
              <p className="text-xs uppercase tracking-[0.25em] text-sand/50">
                Contato
              </p>
              <p className="mt-4 text-sm text-sand/80">{POUSADA.address}</p>
              <p className="mt-2 text-sm text-sand/80">
                Check-in 14h · Check-out até 12h
              </p>
              <a
                href={buildWhatsAppUrl(
                  "Olá! Vim pelo site da Pousada Recanto da Paz e gostaria de mais informações."
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-whatsapp"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-claydark"
              >
                <MessageCircle size={16} /> Falar com a pousada
              </a>
            </div>

            <div data-testid="footer-platforms">
              <p className="text-xs uppercase tracking-[0.25em] text-sand/50">
                Plataformas
              </p>
              <div className="mt-4 flex flex-col items-start gap-2">
                <a
                  href={OTA.airbnb}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-airbnb"
                  className="text-sm text-sand/80 transition-colors hover:text-linen"
                >
                  Reservar via Airbnb
                </a>
                <a
                  href={OTA.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-booking"
                  className="text-sm text-sand/80 transition-colors hover:text-linen"
                >
                  Reservar via Booking.com
                </a>
                <a
                  href="#reservas"
                  data-testid="footer-direct"
                  className="text-sm text-sand/80 transition-colors hover:text-linen"
                >
                  Reserva direta (sem taxas)
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col gap-2 border-t border-sand/10 pt-6 text-[11px] text-sand/45 sm:flex-row sm:items-center sm:justify-between">
          <p data-testid="footer-copyright">
            © {year} Pousada Recanto da Paz — Lindoia, SP
          </p>
          <p>Fotos oficiais da pousada via perfil do Google Maps</p>
        </div>
      </div>
    </footer>
  );
}
