import React, { useEffect } from "react";
import "./App.css";
import Lenis from "lenis";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Stays from "./components/Stays";
import Amenities from "./components/Amenities";
import Gallery from "./components/Gallery";
import Reservation from "./components/Reservation";
import LocationSection from "./components/LocationSection";
import Footer from "./components/Footer";
import WhatsAppFab from "./components/WhatsAppFab";
import Painel from "./painel/Painel";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-sand p-8 text-center">
          <p className="font-serif text-3xl text-ink">
            Algo saiu do trilho — recarregue a página.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function Landing() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (hash.length > 1 && document.querySelector(hash)) {
        e.preventDefault();
        lenis.scrollTo(hash, { offset: -70, duration: 1.4 });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <main className="bg-sand text-ink">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Stays />
      <Amenities />
      <Gallery />
      <Reservation />
      <LocationSection />
      <Footer />
      <WhatsAppFab />
      <Toaster position="top-center" richColors />
    </main>
  );
}

export default function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return (
    <ErrorBoundary>
      {window.location.pathname === '/painel' || window.location.pathname.startsWith('/painel/') ? <Painel /> : <Landing />}
    </ErrorBoundary>
  );
}
