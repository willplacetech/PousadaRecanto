import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "../config";

export default function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppUrl(
        "Olá! Vim pelo site da Pousada Recanto da Paz e gostaria de fazer uma reserva."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      data-testid="whatsapp-fab"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  );
}
