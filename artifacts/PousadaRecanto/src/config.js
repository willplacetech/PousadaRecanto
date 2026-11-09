export const POUSADA = {
  name: "Pousada Recanto da Paz",
  city: "Lindoia, SP",
  address: "Rua do Vento Bravo, 2 — Lindoia, SP",
  coords: { lat: -22.5267135, lng: -46.6318081 },
  mapsUrl:
    "https://www.google.com/maps/place/Pousada+Recanto+da+Paz/@-22.5267135,-46.6318081,17z",
  checkin: "14h",
  checkout: "até 12h",
  // Número da pousada no formato 55DDNNNNNNNNN.
  // Vazio = o WhatsApp abre com a mensagem pronta para o hóspede escolher o contato.
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "",
};

export const OTA = {
  airbnb: import.meta.env.VITE_AIRBNB_URL || "https://www.airbnb.com.br",
  booking:
    "https://www.booking.com/hotel/br/pousada-recanto-da-paz-lindoia-sp.pt-br.html",
};

export const HERO_IMG = "/photos/booking_1.jpg";

export const GALLERY = [
  {
    src: "/photos/booking_1.jpg",
    alt: "Área externa e piscina da pousada",
    official: true,
  },
  {
    src: "/photos/booking_patio.jpg",
    alt: "Pátio e área de convivência ao ar livre",
    official: true,
  },
  {
    src: "/photos/booking_porch.jpg",
    alt: "Varanda aconchegante com redes para descanso",
    official: true,
  },
  {
    src: "/photos/booking_room1.jpg",
    alt: "Suíte confortável com ar-condicionado",
    official: true,
  },
  {
    src: "/photos/google_1.jpg",
    alt: "Vista panorâmica da pousada e jardins",
    official: true,
  },
  {
    src: "/photos/main_streetview.jpg",
    alt: "Fachada e entrada principal da Pousada Recanto da Paz",
    official: true,
  },
];

export const buildWhatsAppUrl = (message) => {
  const text = encodeURIComponent(message);
  return POUSADA.whatsappNumber
    ? `https://wa.me/${POUSADA.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
};
