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

export const HERO_IMG = "/photos/gmap_1.jpg";

export const GALLERY = [
  {
    src: "/photos/gmap_1.jpg",
    alt: "Piscina ao ar livre com cascata",
    official: true,
  },
  {
    src: "/photos/gmap_2.jpg",
    alt: "Área de estar ao ar livre sob guarda-sóis de palha",
    official: true,
  },
  {
    src: "/photos/gmap_3.jpg",
    alt: "Deck de madeira com pergolado e luzes",
    official: true,
  },
  {
    src: "/photos/gmap_4.jpg",
    alt: "Redes sob pergolado de palha à noite — Bom Descanço",
    official: true,
  },
  {
    src: "/photos/gmap_5.jpg",
    alt: "Entrada do salão de café da manhã e recepção",
    official: true,
  },
  {
    src: "/photos/gmap_6.jpg",
    alt: "Fachada amarela com varanda, redes e gramado",
    official: true,
  },
];

export const buildWhatsAppUrl = (message) => {
  const text = encodeURIComponent(message);
  return POUSADA.whatsappNumber
    ? `https://wa.me/${POUSADA.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
};
