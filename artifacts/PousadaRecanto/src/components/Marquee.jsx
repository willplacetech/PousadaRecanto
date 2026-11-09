const ITEMS = [
  "Piscina ao ar livre",
  "Serra & silêncio",
  "Jardim & terraço ensolarado",
  "Café da manhã na serra",
  "Lindoia · Circuito das Águas",
  "Sossego na medida",
];

const Loop = ({ hidden = false }) => (
  <div aria-hidden={hidden} className="flex shrink-0 items-center">
    {ITEMS.map((t, i) => (
      <span
        key={i}
        className="flex items-center font-serif text-xl italic text-ink/75 md:text-2xl"
      >
        <span className="mx-7 whitespace-nowrap md:mx-10">{t}</span>
        <span className="text-clay" aria-hidden="true">
          ·
        </span>
      </span>
    ))}
  </div>
);

export default function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-hairline bg-card py-5"
      data-testid="marquee"
    >
      <div className="flex w-max animate-marquee">
        <Loop />
        <Loop hidden />
      </div>
    </div>
  );
}
