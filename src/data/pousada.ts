export const POUSADA = {
  name: "Pousada Recanto da Paz",
  city: "Lindóia, SP",
  address: "Rua do Vento Bravo, 2 — Lindóia, SP",
  cep: "13950-000",
  coords: { lat: -22.5267135, lng: -46.6318081 },
  mapsUrl:
    "https://www.google.com/maps/place/Pousada+Recanto+da+Paz/@-22.5267135,-46.6318081,17z",
  checkin: "14h",
  checkout: "até 12h",
  whatsappNumber: "",
};

export const OTA = {
  airbnb: "https://www.airbnb.com.br",
  booking:
    "https://www.booking.com/hotel/br/pousada-recanto-da-paz-lindoia-sp.pt-br.html",
};

export type Album = "piscina" | "quartos" | "casa" | "fachada";

export type Photo = {
  src: string;
  alt: string;
  album: Album;
  w: number;
  h: number;
};

export const PHOTOS: Photo[] = [
  {
    src: "/photos/pool-deck.jpg",
    alt: "Piscina com deque de madeira, espreguiçadeiras e guarda-sóis",
    album: "piscina",
    w: 1680,
    h: 1120,
  },
  {
    src: "/photos/pool-loungers.jpg",
    alt: "Piscina ao ar livre cercada pelo jardim",
    album: "piscina",
    w: 1680,
    h: 1120,
  },
  {
    src: "/photos/pool-portrait.jpg",
    alt: "Piscina vista do alto, com cascata e cadeiras brancas",
    album: "piscina",
    w: 1260,
    h: 1680,
  },
  {
    src: "/photos/facade-hills.jpg",
    alt: "Fachada de telhado de barro, estacionamento e a serra ao fundo",
    album: "fachada",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/facade-yard.jpg",
    alt: "Pátio da frente e fachada da pousada",
    album: "fachada",
    w: 1680,
    h: 1081,
  },
  {
    src: "/photos/facade-palm.jpg",
    alt: "Fachada de tijolo, palmeira e portão branco",
    album: "fachada",
    w: 1024,
    h: 683,
  },
  {
    src: "/photos/arrival.jpg",
    alt: "Chegada pela Rua do Vento Bravo, com a palmeira na esquina",
    album: "fachada",
    w: 1280,
    h: 853,
  },
  {
    src: "/photos/street-gate.jpg",
    alt: "Muro, portão e a casa ao fundo da rua",
    album: "fachada",
    w: 1024,
    h: 683,
  },
  {
    src: "/photos/street-view.jpg",
    alt: "A pousada vista da calçada, com o corredor do jardim",
    album: "fachada",
    w: 1680,
    h: 1120,
  },
  {
    src: "/photos/room-garden.jpg",
    alt: "Suíte com cama de casal, ar-condicionado e vista do jardim",
    album: "quartos",
    w: 1680,
    h: 1120,
  },
  {
    src: "/photos/room-pool.jpg",
    alt: "Quarto com duas camas e vista para a piscina",
    album: "quartos",
    w: 1024,
    h: 683,
  },
  {
    src: "/photos/room-suite.jpg",
    alt: "Suíte de casal com guarda-roupa e criado-mudo",
    album: "quartos",
    w: 1680,
    h: 1136,
  },
  {
    src: "/photos/room-flowers.jpg",
    alt: "Quarto com vaso de flores e cama de casal arrumada",
    album: "quartos",
    w: 1680,
    h: 991,
  },
  {
    src: "/photos/room-twin.jpg",
    alt: "Quarto família com duas camas e colcha azul",
    album: "quartos",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/room-double.jpg",
    alt: "Quarto amplo com duas camas de solteiro",
    album: "quartos",
    w: 1680,
    h: 780,
  },
  {
    src: "/photos/room-window.jpg",
    alt: "Quarto com janela, cortinas e cama de casal",
    album: "quartos",
    w: 852,
    h: 1280,
  },
  {
    src: "/photos/room-tv.jpg",
    alt: "Quarto com televisão, cama arrumada e porta de vidro",
    album: "quartos",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/room-linen.jpg",
    alt: "Detalhe das toalhas brancas e da colcha azul",
    album: "quartos",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/minibar.jpg",
    alt: "Frigobar e cabides no quarto",
    album: "quartos",
    w: 852,
    h: 1280,
  },
  {
    src: "/photos/bath-marble.jpg",
    alt: "Banheiro privativo com pia de mármore e box de vidro",
    album: "quartos",
    w: 1358,
    h: 1280,
  },
  {
    src: "/photos/bath-glass.jpg",
    alt: "Banheiro com pia, vaso sanitário e box",
    album: "quartos",
    w: 1680,
    h: 1176,
  },
  {
    src: "/photos/bath-tile.jpg",
    alt: "Banheiro claro com chuveiro e bancada",
    album: "quartos",
    w: 1680,
    h: 1120,
  },
  {
    src: "/photos/bath-shower.jpg",
    alt: "Box do banheiro e cabideiro ao lado",
    album: "quartos",
    w: 1680,
    h: 1112,
  },
  {
    src: "/photos/kitchen.jpg",
    alt: "Cozinha compartilhada com fogão, micro-ondas e geladeira",
    album: "casa",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/kitchen-counter.jpg",
    alt: "Bancada da cozinha com micro-ondas e pia",
    album: "casa",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/kitchen-porch.jpg",
    alt: "Varanda da cozinha, com mesas, plantas e telhado de barro",
    album: "casa",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/kitchen-path.jpg",
    alt: "Passagem coberta entre os quartos e a cozinha",
    album: "casa",
    w: 1680,
    h: 1118,
  },
  {
    src: "/photos/dining-cover.jpg",
    alt: "Área coberta com mesa para refeições ao ar livre",
    album: "casa",
    w: 1024,
    h: 683,
  },
  {
    src: "/photos/breakfast.jpg",
    alt: "Sala de refeições com mesa posta",
    album: "casa",
    w: 720,
    h: 1280,
  },
  {
    src: "/photos/garden-walk.jpg",
    alt: "Corredor ajardinado com mamoeiro ao longo dos quartos",
    album: "casa",
    w: 1024,
    h: 683,
  },
  {
    src: "/photos/side-hall.jpg",
    alt: "Corredor lateral da casa, com janelas e piso claro",
    album: "casa",
    w: 576,
    h: 768,
  },
  {
    src: "/photos/roses.jpg",
    alt: "Rosas brancas do jardim da pousada",
    album: "casa",
    w: 852,
    h: 1280,
  },
];

export const photo = (src: string) => {
  const found = PHOTOS.find((item) => item.src === src);
  if (!found) throw new Error(`Foto ausente: ${src}`);
  return found;
};

export const ALBUMS: { id: "todas" | Album; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "piscina", label: "Piscina" },
  { id: "quartos", label: "Quartos" },
  { id: "casa", label: "A Pousada" },
  { id: "fachada", label: "Fachada" },
];

export const STAYS = [
  {
    id: "Suíte casal",
    name: "Suíte casal",
    photo: photo("/photos/room-garden.jpg"),
    text: "Cama de casal, ar-condicionado, TV e janela para o jardim. Toalhas dobradas, frigobar e banheiro privativo.",
    points: ["Cama de casal", "Ar-condicionado", "Banheiro privativo"],
  },
  {
    id: "Quarto família",
    name: "Quarto família",
    photo: photo("/photos/room-twin.jpg"),
    text: "Duas camas arrumadas com a colcha azul da casa — espaço para quem viaja junto, com o mesmo silêncio do fim da rua.",
    points: ["Duas camas", "TV", "Frigobar"],
  },
  {
    id: "Vista para a piscina",
    name: "Vista para a piscina",
    photo: photo("/photos/room-pool.jpg"),
    text: "Quarto com duas camas e a piscina logo à janela. De manhã, o deque e os guarda-sóis estão a poucos passos.",
    points: ["Vista da piscina", "Duas camas", "Ventilado"],
  },
] as const;

export function buildWhatsAppUrl(message: string) {
  const text = encodeURIComponent(message);
  return POUSADA.whatsappNumber
    ? `https://wa.me/${POUSADA.whatsappNumber}?text=${text}`
    : `https://api.whatsapp.com/send?text=${text}`;
}
