import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Car, a as Tv, b as ArrowDown, c as Navigation, d as MapPin, f as ExternalLink, g as ChevronLeft, h as ChevronRight, i as UtensilsCrossed, l as MessageCircle, m as Clock, n as Wind, p as Coffee, r as Wifi, s as ShieldCheck, t as X, u as Menu, v as Bath, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BbwqK8nO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var POUSADA = {
	name: "Pousada Recanto da Paz",
	city: "Lindóia, SP",
	address: "Rua do Vento Bravo, 2 — Lindóia, SP",
	cep: "13950-000",
	coords: {
		lat: -22.5267135,
		lng: -46.6318081
	},
	mapsUrl: "https://www.google.com/maps/place/Pousada+Recanto+da+Paz/@-22.5267135,-46.6318081,17z",
	checkin: "14h",
	checkout: "até 12h",
	whatsappNumber: ""
};
var OTA = {
	airbnb: "https://www.airbnb.com.br",
	booking: "https://www.booking.com/hotel/br/pousada-recanto-da-paz-lindoia-sp.pt-br.html"
};
var PHOTOS = [
	{
		src: "/photos/pool-deck.jpg",
		alt: "Piscina com deque de madeira, espreguiçadeiras e guarda-sóis",
		album: "piscina",
		w: 1680,
		h: 1120
	},
	{
		src: "/photos/pool-loungers.jpg",
		alt: "Piscina ao ar livre cercada pelo jardim",
		album: "piscina",
		w: 1680,
		h: 1120
	},
	{
		src: "/photos/pool-portrait.jpg",
		alt: "Piscina vista do alto, com cascata e cadeiras brancas",
		album: "piscina",
		w: 1260,
		h: 1680
	},
	{
		src: "/photos/facade-hills.jpg",
		alt: "Fachada de telhado de barro, estacionamento e a serra ao fundo",
		album: "fachada",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/facade-yard.jpg",
		alt: "Pátio da frente e fachada da pousada",
		album: "fachada",
		w: 1680,
		h: 1081
	},
	{
		src: "/photos/facade-palm.jpg",
		alt: "Fachada de tijolo, palmeira e portão branco",
		album: "fachada",
		w: 1024,
		h: 683
	},
	{
		src: "/photos/arrival.jpg",
		alt: "Chegada pela Rua do Vento Bravo, com a palmeira na esquina",
		album: "fachada",
		w: 1280,
		h: 853
	},
	{
		src: "/photos/street-gate.jpg",
		alt: "Muro, portão e a casa ao fundo da rua",
		album: "fachada",
		w: 1024,
		h: 683
	},
	{
		src: "/photos/street-view.jpg",
		alt: "A pousada vista da calçada, com o corredor do jardim",
		album: "fachada",
		w: 1680,
		h: 1120
	},
	{
		src: "/photos/room-garden.jpg",
		alt: "Suíte com cama de casal, ar-condicionado e vista do jardim",
		album: "quartos",
		w: 1680,
		h: 1120
	},
	{
		src: "/photos/room-pool.jpg",
		alt: "Quarto com duas camas e vista para a piscina",
		album: "quartos",
		w: 1024,
		h: 683
	},
	{
		src: "/photos/room-suite.jpg",
		alt: "Suíte de casal com guarda-roupa e criado-mudo",
		album: "quartos",
		w: 1680,
		h: 1136
	},
	{
		src: "/photos/room-flowers.jpg",
		alt: "Quarto com vaso de flores e cama de casal arrumada",
		album: "quartos",
		w: 1680,
		h: 991
	},
	{
		src: "/photos/room-twin.jpg",
		alt: "Quarto família com duas camas e colcha azul",
		album: "quartos",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/room-double.jpg",
		alt: "Quarto amplo com duas camas de solteiro",
		album: "quartos",
		w: 1680,
		h: 780
	},
	{
		src: "/photos/room-window.jpg",
		alt: "Quarto com janela, cortinas e cama de casal",
		album: "quartos",
		w: 852,
		h: 1280
	},
	{
		src: "/photos/room-tv.jpg",
		alt: "Quarto com televisão, cama arrumada e porta de vidro",
		album: "quartos",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/room-linen.jpg",
		alt: "Detalhe das toalhas brancas e da colcha azul",
		album: "quartos",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/minibar.jpg",
		alt: "Frigobar e cabides no quarto",
		album: "quartos",
		w: 852,
		h: 1280
	},
	{
		src: "/photos/bath-marble.jpg",
		alt: "Banheiro privativo com pia de mármore e box de vidro",
		album: "quartos",
		w: 1358,
		h: 1280
	},
	{
		src: "/photos/bath-glass.jpg",
		alt: "Banheiro com pia, vaso sanitário e box",
		album: "quartos",
		w: 1680,
		h: 1176
	},
	{
		src: "/photos/bath-tile.jpg",
		alt: "Banheiro claro com chuveiro e bancada",
		album: "quartos",
		w: 1680,
		h: 1120
	},
	{
		src: "/photos/bath-shower.jpg",
		alt: "Box do banheiro e cabideiro ao lado",
		album: "quartos",
		w: 1680,
		h: 1112
	},
	{
		src: "/photos/kitchen.jpg",
		alt: "Cozinha compartilhada com fogão, micro-ondas e geladeira",
		album: "casa",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/kitchen-counter.jpg",
		alt: "Bancada da cozinha com micro-ondas e pia",
		album: "casa",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/kitchen-porch.jpg",
		alt: "Varanda da cozinha, com mesas, plantas e telhado de barro",
		album: "casa",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/kitchen-path.jpg",
		alt: "Passagem coberta entre os quartos e a cozinha",
		album: "casa",
		w: 1680,
		h: 1118
	},
	{
		src: "/photos/dining-cover.jpg",
		alt: "Área coberta com mesa para refeições ao ar livre",
		album: "casa",
		w: 1024,
		h: 683
	},
	{
		src: "/photos/breakfast.jpg",
		alt: "Sala de refeições com mesa posta",
		album: "casa",
		w: 720,
		h: 1280
	},
	{
		src: "/photos/garden-walk.jpg",
		alt: "Corredor ajardinado com mamoeiro ao longo dos quartos",
		album: "casa",
		w: 1024,
		h: 683
	},
	{
		src: "/photos/side-hall.jpg",
		alt: "Corredor lateral da casa, com janelas e piso claro",
		album: "casa",
		w: 576,
		h: 768
	},
	{
		src: "/photos/roses.jpg",
		alt: "Rosas brancas do jardim da pousada",
		album: "casa",
		w: 852,
		h: 1280
	}
];
var photo = (src) => {
	const found = PHOTOS.find((item) => item.src === src);
	if (!found) throw new Error(`Foto ausente: ${src}`);
	return found;
};
var ALBUMS = [
	{
		id: "todas",
		label: "Todas"
	},
	{
		id: "piscina",
		label: "Piscina"
	},
	{
		id: "quartos",
		label: "Quartos"
	},
	{
		id: "casa",
		label: "A casa"
	},
	{
		id: "fachada",
		label: "Fachada"
	}
];
var STAYS = [
	{
		id: "Suíte casal",
		name: "Suíte casal",
		photo: photo("/photos/room-garden.jpg"),
		text: "Cama de casal, ar-condicionado, TV e janela para o jardim. Toalhas dobradas, frigobar e banheiro privativo.",
		points: [
			"Cama de casal",
			"Ar-condicionado",
			"Banheiro privativo"
		]
	},
	{
		id: "Quarto família",
		name: "Quarto família",
		photo: photo("/photos/room-twin.jpg"),
		text: "Duas camas arrumadas com a colcha azul da casa — espaço para quem viaja junto, com o mesmo silêncio do fim da rua.",
		points: [
			"Duas camas",
			"TV",
			"Frigobar"
		]
	},
	{
		id: "Vista para a piscina",
		name: "Vista para a piscina",
		photo: photo("/photos/room-pool.jpg"),
		text: "Quarto com duas camas e a piscina logo à janela. De manhã, o deque e os guarda-sóis estão a poucos passos.",
		points: [
			"Vista da piscina",
			"Duas camas",
			"Ventilado"
		]
	}
];
function buildWhatsAppUrl(message) {
	const text = encodeURIComponent(message);
	return POUSADA.whatsappNumber ? `https://wa.me/${POUSADA.whatsappNumber}?text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
}
function LogoMark({ className = "h-9 w-9" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "64",
				height: "64",
				rx: "14",
				fill: "#18221B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 44 L24 24 L34 37 L42 28 L56 44",
				fill: "none",
				stroke: "#5C745D",
				strokeWidth: "4",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "44",
				cy: "17",
				r: "6",
				fill: "#C86D51"
			})
		]
	});
}
function Eyebrow({ children, light = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: `text-xs font-semibold uppercase tracking-[0.22em] ${light ? "text-linen" : "text-sage"}`,
		children
	});
}
function Reveal({ children, className = "", delay = 0 }) {
	const ref = (0, import_react.useRef)(null);
	const [on, setOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) setOn(true);
		}, { threshold: .16 });
		io.observe(el);
		return () => io.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		style: { transitionDelay: `${delay}ms` },
		className: `reveal ${on ? "reveal-on" : ""} ${className}`,
		children
	});
}
function Photo({ src, alt, width, height, className = "", priority = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		width,
		height,
		loading: priority ? "eager" : "lazy",
		decoding: "async",
		className
	});
}
function Gallery() {
	const [album, setAlbum] = (0, import_react.useState)("todas");
	const [index, setIndex] = (0, import_react.useState)(null);
	const items = album === "todas" ? PHOTOS : PHOTOS.filter((photo) => photo.album === album);
	(0, import_react.useEffect)(() => {
		if (index === null) return;
		const onKey = (event) => {
			if (event.key === "Escape") setIndex(null);
			if (event.key === "ArrowRight") setIndex((current) => current === null ? current : (current + 1) % items.length);
			if (event.key === "ArrowLeft") setIndex((current) => current === null ? current : (current - 1 + items.length) % items.length);
		};
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [index, items.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "galeria",
		className: "bg-linen/50 py-20 md:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5 md:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Galeria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl",
						children: ["A casa, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "text-clay",
							children: "quarto por quarto"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-sm text-sm leading-relaxed text-moss",
						children: [PHOTOS.length, " fotografias da pousada — piscina, quartos, cozinha e a fachada com a serra atrás."]
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex gap-2 overflow-x-auto pb-1",
					children: ALBUMS.map((item) => {
						const active = album === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setAlbum(item.id);
								setIndex(null);
							},
							className: `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-pine text-sand" : "bg-card text-moss hover:text-ink"}`,
							"aria-pressed": active,
							children: item.label
						}, item.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 columns-2 gap-3 md:columns-3 md:gap-4",
					children: items.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i % 6 * 40,
						className: "mb-3 break-inside-avoid md:mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIndex(i),
							className: "group block w-full overflow-hidden rounded-2xl bg-linen shadow-soft",
							"aria-label": `Abrir foto: ${img.alt}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img.src,
								alt: img.alt,
								width: img.w,
								height: img.h,
								loading: "lazy",
								className: "w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
							})
						})
					}, img.src))
				})
			]
		}), index !== null && items[index] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[70] flex items-center justify-center bg-pine/95 p-4",
			onClick: () => setIndex(null),
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Foto ampliada",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-sand",
					onClick: () => setIndex(null),
					"aria-label": "Fechar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 28 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute left-2 flex h-11 w-11 items-center justify-center text-sand md:left-5",
					onClick: (event) => {
						event.stopPropagation();
						setIndex((current) => current === null ? current : (current - 1 + items.length) % items.length);
					},
					"aria-label": "Foto anterior",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 34 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					onClick: (event) => event.stopPropagation(),
					className: "max-h-[88vh] max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: items[index].src,
						alt: items[index].alt,
						className: "max-h-[74vh] w-auto max-w-full rounded-xl object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "mt-3 text-center text-sm text-sand/80",
						children: [
							items[index].alt,
							" — ",
							index + 1,
							"/",
							items.length
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute right-2 flex h-11 w-11 items-center justify-center text-sand md:right-5",
					onClick: (event) => {
						event.stopPropagation();
						setIndex((current) => current === null ? current : (current + 1) % items.length);
					},
					"aria-label": "Próxima foto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 34 })
				})
			]
		})]
	});
}
var empty = {
	name: "",
	phone: "",
	stay: STAYS[0].id,
	checkin: "",
	checkout: "",
	guests: "2",
	notes: ""
};
var fieldClass = "w-full rounded-xl border border-hairline bg-sand px-4 py-3 text-sm text-ink outline-none transition placeholder:text-fog focus:border-clay";
function fmt(iso) {
	if (!iso) return "";
	const [year, month, day] = iso.split("-");
	return `${day}/${month}/${year}`;
}
function Reservation() {
	const [form, setForm] = (0, import_react.useState)(empty);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [sent, setSent] = (0, import_react.useState)(false);
	const side = STAYS[0].photo;
	const set = (key) => (event) => {
		setForm((current) => ({
			...current,
			[key]: event.target.value
		}));
	};
	const onSubmit = (event) => {
		event.preventDefault();
		const next = {};
		if (form.name.trim().length < 3) next.name = "Informe seu nome completo.";
		const digits = form.phone.replace(/\D/g, "");
		if (digits.length < 10 || digits.length > 13) next.phone = "DDD + número, ex: (19) 99999-9999.";
		if (!form.checkin) next.checkin = "Escolha o check-in.";
		if (!form.checkout) next.checkout = "Escolha o check-out.";
		if (form.checkin && form.checkout && form.checkout <= form.checkin) next.checkout = "O check-out precisa ser depois do check-in.";
		setErrors(next);
		if (Object.keys(next).length) return;
		const message = [
			"Olá! Gostaria de reservar na Pousada Recanto da Paz.",
			"",
			`• Nome: ${form.name.trim()}`,
			`• Telefone: ${form.phone.trim()}`,
			`• Estadia: ${form.stay}`,
			`• Check-in: ${fmt(form.checkin)}`,
			`• Check-out: ${fmt(form.checkout)}`,
			`• Hóspedes: ${form.guests}`,
			form.notes.trim() ? `• Observações: ${form.notes.trim()}` : "",
			"",
			"Enviado pelo site da pousada."
		].filter(Boolean).join("\n");
		window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
		setSent(true);
		setForm(empty);
		toast.success("Mensagem pronta no WhatsApp. É só enviar para a pousada.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "reservas",
		className: "mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "lg:col-span-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-full min-h-80 overflow-hidden rounded-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
							src: side.src,
							alt: side.alt,
							width: side.w,
							height: side.h,
							className: "absolute inset-0 h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-pine/80 via-pine/10 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 bottom-0 left-0 p-6 text-sand",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-3xl",
								children: "Reserve direto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-xs text-sm leading-relaxed text-sand/80",
								children: "Sem taxa de plataforma. A pousada confirma datas e valor pelo WhatsApp."
							})]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				delay: 80,
				className: "lg:col-span-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Reservas" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl",
						children: ["Diga as datas. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "text-clay",
							children: "A gente responde."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-8 grid gap-4 sm:grid-cols-2",
						noValidate: true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm sm:col-span-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block font-medium text-ink",
										children: "Nome"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: fieldClass,
										value: form.name,
										onChange: set("name"),
										autoComplete: "name",
										placeholder: "Seu nome"
									}),
									errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-claydark",
										children: errors.name
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block font-medium text-ink",
										children: "WhatsApp"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: fieldClass,
										value: form.phone,
										onChange: set("phone"),
										inputMode: "tel",
										autoComplete: "tel",
										placeholder: "(19) 99999-9999"
									}),
									errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-claydark",
										children: errors.phone
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block font-medium text-ink",
									children: "Estadia"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: fieldClass,
									value: form.stay,
									onChange: set("stay"),
									children: [STAYS.map((stay) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: stay.id }, stay.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Ainda não sei — quero uma sugestão" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block font-medium text-ink",
										children: "Check-in"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: fieldClass,
										type: "date",
										value: form.checkin,
										onChange: set("checkin")
									}),
									errors.checkin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-claydark",
										children: errors.checkin
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block font-medium text-ink",
										children: "Check-out"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: fieldClass,
										type: "date",
										value: form.checkout,
										onChange: set("checkout")
									}),
									errors.checkout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-claydark",
										children: errors.checkout
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block font-medium text-ink",
									children: "Hóspedes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: fieldClass,
									value: form.guests,
									onChange: set("guests"),
									children: [
										"1",
										"2",
										"3",
										"4",
										"5",
										"6+"
									].map((count) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: count }, count))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block font-medium text-ink",
									children: "Observações"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: `${fieldClass} min-h-24 resize-y`,
									value: form.notes,
									onChange: set("notes"),
									placeholder: "Crianças, horários, pedido especial"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "inline-flex items-center justify-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-card transition-colors hover:bg-claydark",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 16 }),
										"Enviar pedido no WhatsApp",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
									]
								}), sent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-moss",
									children: "Se o WhatsApp não abriu, permita pop-ups e tente de novo."
								})]
							})
						]
					})
				]
			})]
		})
	});
}
var NAV = [
	{
		href: "#pousada",
		label: "A pousada"
	},
	{
		href: "#estadias",
		label: "Estadias"
	},
	{
		href: "#comodidades",
		label: "Comodidades"
	},
	{
		href: "#galeria",
		label: "Galeria"
	},
	{
		href: "#localizacao",
		label: "Como chegar"
	}
];
var MARQUEE = [
	"Piscina ao ar livre",
	"Serra de Lindóia",
	"Quartos com ar-condicionado",
	"Cozinha compartilhada",
	"Estacionamento na porta",
	"Café da manhã"
];
var AMENITIES = [
	{
		icon: Wifi,
		title: "Wi-Fi gratuito",
		sub: "nas áreas da casa"
	},
	{
		icon: Car,
		title: "Estacionamento",
		sub: "privativo, na frente"
	},
	{
		icon: Wind,
		title: "Ar-condicionado",
		sub: "nos quartos"
	},
	{
		icon: Tv,
		title: "TV e frigobar",
		sub: "em cada quarto"
	},
	{
		icon: Coffee,
		title: "Café da manhã",
		sub: "mesa posta na casa"
	},
	{
		icon: UtensilsCrossed,
		title: "Cozinha",
		sub: "fogão, micro-ondas, geladeira"
	},
	{
		icon: Bath,
		title: "Banheiro privativo",
		sub: "box de vidro"
	},
	{
		icon: ShieldCheck,
		title: "Casa fechada",
		sub: "portão e rua tranquila"
	}
];
function Navbar() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const tone = scrolled || open ? "text-ink" : "text-sand";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? "border-b border-hairline bg-sand/92 backdrop-blur-md" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#topo",
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `font-serif text-xl leading-none ${tone}`,
						children: ["Recanto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "da Paz" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-7 md:flex",
					children: [NAV.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						className: `text-sm font-medium transition-colors hover:text-clay ${scrolled ? "text-moss" : "text-sand/90"}`,
						children: link.label
					}, link.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#reservas",
						className: "rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-card hover:bg-claydark",
						children: "Reservar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `flex h-11 w-11 items-center justify-center md:hidden ${tone}`,
					"aria-label": open ? "Fechar menu" : "Abrir menu",
					onClick: () => setOpen((value) => !value),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "flex flex-col gap-1 border-t border-hairline px-5 py-4 md:hidden",
			children: [NAV.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: link.href,
				onClick: () => setOpen(false),
				className: "rounded-xl px-3 py-3 text-base font-medium text-ink",
				children: link.label
			}, link.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#reservas",
				onClick: () => setOpen(false),
				className: "mt-2 rounded-full bg-clay px-5 py-3 text-center text-sm font-semibold text-card",
				children: "Reservar estadia"
			})]
		})]
	});
}
function Hero() {
	const hero = photo("/photos/pool-deck.jpg");
	const thumbs = [
		photo("/photos/room-garden.jpg"),
		photo("/photos/kitchen-porch.jpg"),
		photo("/photos/facade-hills.jpg"),
		photo("/photos/roses.jpg")
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "topo",
		className: "relative flex min-h-[100svh] flex-col overflow-hidden bg-pine",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero.src,
				alt: hero.alt,
				width: hero.w,
				height: hero.h,
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-pine/75 via-pine/25 to-pine/85" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-28 pb-8 md:px-10 md:pb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
						light: true,
						children: "Pousada · Lindóia, SP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 font-serif text-6xl leading-[0.92] text-sand sm:text-7xl lg:text-8xl",
						children: ["Recanto", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block italic text-linen",
							children: "da Paz"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-lg text-base leading-relaxed text-sand/90 md:text-lg",
						children: "Piscina com deque de madeira, quartos claros e a serra no fundo do pátio. Uma casa simples, arrumada com cuidado, para dias mais lentos."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#reservas",
							className: "rounded-full bg-clay px-7 py-3.5 text-center text-sm font-semibold text-card hover:bg-claydark",
							children: "Reservar estadia"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#galeria",
							className: "rounded-full border border-sand/40 px-7 py-3.5 text-center text-sm font-semibold text-sand hover:bg-sand/10",
							children: [
								"Ver as ",
								PHOTOS.length,
								" fotos"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex gap-3 overflow-x-auto pb-1",
						children: thumbs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#galeria",
							"aria-label": item.alt,
							className: "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-sand/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.src,
								alt: "",
								className: "h-full w-full object-cover"
							})
						}, item.src))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 border-t border-sand/15",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-7xl grid-cols-2 gap-y-3 px-5 py-4 md:grid-cols-4 md:px-10",
					children: [
						["Check-in", "a partir das 14h"],
						["Check-out", "até 12h"],
						["Lazer", "piscina ao ar livre"],
						["Chegada", "estacionamento na porta"]
					].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-sand/60",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-sand",
						children: value
					})] }, label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
				className: "absolute right-6 bottom-28 hidden text-sand/70 md:block",
				size: 22
			})
		]
	});
}
function Marquee() {
	const row = [...MARQUEE, ...MARQUEE];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden border-y border-hairline bg-card py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-marquee flex w-max",
			children: row.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center font-serif text-xl italic text-ink/80 md:text-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-7 whitespace-nowrap md:mx-10",
					children: item
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-clay",
					children: "·"
				})]
			}, `${item}-${index}`))
		})
	});
}
function About() {
	const main = photo("/photos/facade-hills.jpg");
	const pool = photo("/photos/pool-portrait.jpg");
	const linen = photo("/photos/room-linen.jpg");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "pousada",
		className: "mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-start gap-12 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "A pousada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl",
						children: ["Telhado de barro, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "text-clay",
							children: "serra atrás"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 80,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 leading-relaxed text-moss",
							children: "A Recanto da Paz fica na Rua do Vento Bravo, em Lindóia, no Circuito das Águas Paulista. A casa é baixa, com pátio na frente, estacionamento marcado e o morro verde logo depois do muro."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 leading-relaxed text-moss",
							children: "Por dentro, quartos brancos com cama arrumada, ar-condicionado, TV e frigobar. A cozinha é compartilhada — fogão, micro-ondas e mesas na varanda coberta para o café que se estica."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 140,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap gap-2",
							children: [
								"Check-in 14h",
								"Check-out 12h",
								"Rua tranquila"
							].map((pill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-hairline bg-card px-4 py-2 text-xs font-medium text-moss",
								children: pill
							}, pill))
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-3xl shadow-lift",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
							src: main.src,
							alt: main.alt,
							width: main.w,
							height: main.h,
							className: "h-72 w-full object-cover md:h-[420px]"
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 80,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-3xl shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
									src: pool.src,
									alt: pool.alt,
									width: pool.w,
									height: pool.h,
									className: "h-44 w-full object-cover md:h-56"
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 140,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-3xl shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
									src: linen.src,
									alt: linen.alt,
									width: linen.w,
									height: linen.h,
									className: "h-44 w-full object-cover md:h-56"
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-right text-xs text-fog",
						children: "Fotos da própria pousada"
					})
				]
			})]
		})
	});
}
function Stays() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "estadias",
		className: "bg-linen/40 py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5 md:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Estadias" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-4 max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl",
					children: ["Quartos claros, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
						className: "text-clay",
						children: "cama feita"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-5 md:grid-cols-3",
					children: STAYS.map((stay, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: index * 70,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-card shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
								src: stay.photo.src,
								alt: stay.photo.alt,
								width: stay.photo.w,
								height: stay.photo.h,
								className: "h-56 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-2xl text-ink",
										children: stay.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-moss",
										children: stay.text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-4 flex flex-wrap gap-2",
										children: stay.points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "rounded-full bg-linen px-3 py-1 text-xs font-medium text-moss",
											children: point
										}, point))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#reservas",
										className: "mt-6 inline-flex text-sm font-semibold text-clay hover:text-claydark",
										children: "Pedir esta estadia"
									})
								]
							})]
						})
					}, stay.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid overflow-hidden rounded-3xl bg-pine text-sand md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
						src: "/photos/kitchen.jpg",
						alt: "Cozinha compartilhada com fogão, micro-ondas e geladeira",
						width: 1680,
						height: 1118,
						className: "h-64 w-full object-cover md:h-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-center p-7 md:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.22em] text-linen",
								children: "A casa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-serif text-3xl",
								children: "Cozinha para o almoço de família"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-sand/75",
								children: "Fogão, micro-ondas, geladeira e bancada branca. Ao lado, a varanda coberta com mesas — o lugar do café e da conversa comprida."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#galeria",
								className: "mt-6 text-sm font-semibold text-linen underline-offset-4 hover:underline",
								children: "Ver a cozinha e a varanda"
							})
						]
					})]
				}) })
			]
		})
	});
}
function Amenities() {
	const pool = photo("/photos/pool-loungers.jpg");
	const dining = photo("/photos/dining-cover.jpg");
	const porch = photo("/photos/kitchen-porch.jpg");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "comodidades",
		className: "mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Comodidades" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "mt-4 max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl",
			children: ["O que a casa ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
				className: "text-clay",
				children: "realmente tem"
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 grid gap-4 md:grid-cols-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "md:col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "relative h-80 overflow-hidden rounded-3xl md:h-full md:min-h-[420px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
							src: pool.src,
							alt: pool.alt,
							width: pool.w,
							height: pool.h,
							className: "absolute inset-0 h-full w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine/80 to-transparent p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-3xl text-sand",
								children: "Piscina ao ar livre"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-sand/75",
								children: "Deque, espreguiçadeiras e guarda-sóis no jardim"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 md:col-span-5",
					children: AMENITIES.slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full min-h-36 flex-col justify-end rounded-3xl border border-hairline bg-card p-5 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "text-sage",
								size: 22
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-semibold text-ink",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-fog",
								children: item.sub
							})
						]
					}) }, item.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "md:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "relative h-64 overflow-hidden rounded-3xl md:h-full md:min-h-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
							src: porch.src,
							alt: porch.alt,
							width: porch.w,
							height: porch.h,
							className: "absolute inset-0 h-full w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "absolute bottom-4 left-4 rounded-full bg-sand/90 px-3 py-1 text-xs font-semibold text-ink",
							children: "Varanda da cozinha"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "md:col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "relative h-64 overflow-hidden rounded-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
							src: dining.src,
							alt: dining.alt,
							width: dining.w,
							height: dining.h,
							className: "absolute inset-0 h-full w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine/75 to-transparent p-5 font-serif text-2xl text-sand",
							children: "Refeições na área coberta"
						})]
					})
				}),
				AMENITIES.slice(4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "md:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full min-h-36 flex-col justify-end rounded-3xl border border-hairline bg-card p-5 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "text-sage",
								size: 22
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-semibold text-ink",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-fog",
								children: item.sub
							})
						]
					})
				}, item.title))
			]
		})]
	});
}
function Location() {
	const dir = `https://www.google.com/maps/dir/?api=1&destination=${POUSADA.coords.lat},${POUSADA.coords.lng}`;
	const embed = `https://maps.google.com/maps?q=${POUSADA.coords.lat},${POUSADA.coords.lng}&z=16&output=embed`;
	const street = photo("/photos/arrival.jpg");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "localizacao",
		className: "bg-card py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:gap-12 md:px-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Como chegar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl",
				children: ["No fim de uma ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "text-clay",
					children: "rua quieta"
				})]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				delay: 80,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-hidden rounded-3xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
							src: street.src,
							alt: street.alt,
							width: street.w,
							height: street.h,
							className: "h-52 w-full object-cover"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-4 text-sm leading-relaxed text-moss",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									className: "mt-0.5 shrink-0 text-sage",
									size: 18
								}),
								POUSADA.address,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: POUSADA.cep
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									className: "mt-0.5 shrink-0 text-sage",
									size: 18
								}),
								"Check-in a partir das ",
								POUSADA.checkin,
								" · check-out ",
								POUSADA.checkout
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: dir,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-sand hover:bg-clay",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { size: 15 }), " Traçar rota"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: POUSADA.mapsUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-6 py-3.5 text-sm font-semibold text-ink hover:border-clay hover:text-clay",
							children: ["Google Maps ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 15 })]
						})]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 100,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-3xl border border-hairline shadow-lift",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: "Mapa da Pousada Recanto da Paz em Lindóia",
						src: embed,
						className: "h-80 w-full md:h-[420px]",
						loading: "lazy",
						referrerPolicy: "no-referrer-when-downgrade"
					})
				})
			})]
		})
	});
}
function Footer() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "bg-pine text-sand",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "h-10 w-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-serif text-2xl",
						children: ["Recanto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "text-linen",
							children: "da Paz"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xs text-sm leading-relaxed text-sand/70",
					children: "Pousada em Lindóia — piscina, jardim e o silêncio de uma rua sem pressa."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.22em] text-sand/50",
						children: "Contato"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-sand/85",
						children: POUSADA.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-sand/70",
						children: ["CEP ", POUSADA.cep]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: buildWhatsAppUrl("Olá! Vim pelo site da Pousada Recanto da Paz e gostaria de mais informações."),
						target: "_blank",
						rel: "noopener noreferrer",
						className: "mt-5 inline-flex items-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-card hover:bg-claydark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 16 }), " Falar com a pousada"]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.22em] text-sand/50",
					children: "Também em"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col items-start gap-2 text-sm text-sand/85",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: OTA.booking,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "hover:text-linen",
							children: "Booking.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: OTA.airbnb,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "hover:text-linen",
							children: "Airbnb"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#reservas",
							className: "hover:text-linen",
							children: "Reserva direta, sem taxa"
						})
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-sand/10 px-5 py-5 text-center text-xs text-sand/50 md:px-10",
			children: [
				"© ",
				year,
				" Pousada Recanto da Paz · Lindóia, SP"
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "bg-sand text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marquee, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stays, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Amenities, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reservation, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Location, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: buildWhatsAppUrl("Olá! Vim pelo site da Pousada Recanto da Paz e gostaria de fazer uma reserva."),
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": "Falar no WhatsApp",
				className: "fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-clay text-card shadow-lift hover:bg-claydark",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 26 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { position: "top-center" })
		]
	});
}
var SplitComponent = Home;
//#endregion
export { SplitComponent as component };
