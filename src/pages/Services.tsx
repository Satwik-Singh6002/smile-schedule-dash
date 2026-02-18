import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: "🦷",
    title: "General Dentistry",
    desc: "Comprehensive checkups, cleanings, and preventive care to keep your teeth healthy for life.",
    features: ["Annual checkups", "Teeth cleanings", "Cavity fillings", "Gum disease treatment"],
    price: "From $80",
  },
  {
    icon: "✨",
    title: "Teeth Whitening",
    desc: "Professional in-office whitening treatments that brighten your smile by up to 8 shades in just one visit.",
    features: ["In-office treatment", "Take-home kits", "Long-lasting results", "Safe & pain-free"],
    price: "From $250",
  },
  {
    icon: "🔬",
    title: "Orthodontics",
    desc: "Modern braces and clear aligners to straighten your teeth comfortably and discreetly.",
    features: ["Traditional braces", "Clear aligners", "Retainers", "Monthly monitoring"],
    price: "From $1,800",
  },
  {
    icon: "🏥",
    title: "Dental Implants",
    desc: "Permanent, natural-looking tooth replacement solutions that restore your smile and confidence.",
    features: ["Single implants", "Implant bridges", "Full arch solutions", "Lifetime support"],
    price: "From $1,200",
  },
  {
    icon: "🚨",
    title: "Emergency Care",
    desc: "Same-day emergency appointments for urgent dental issues. We're here when you need us most.",
    features: ["Same-day appointments", "Tooth pain relief", "Broken tooth repair", "Lost filling/crown"],
    price: "From $120",
  },
  {
    icon: "👶",
    title: "Pediatric Dentistry",
    desc: "Gentle, fun dental care designed specifically for children, making every visit a positive experience.",
    features: ["First visit prep", "Sealants", "Fluoride treatment", "Kid-friendly environment"],
    price: "From $60",
  },
  {
    icon: "🌟",
    title: "Cosmetic Dentistry",
    desc: "Transform your smile with veneers, bonding, and complete smile makeovers tailored to you.",
    features: ["Porcelain veneers", "Dental bonding", "Smile makeovers", "Gum contouring"],
    price: "From $400",
  },
  {
    icon: "🔧",
    title: "Restorative Dentistry",
    desc: "Repair damaged teeth and restore full function with crowns, bridges, and dentures.",
    features: ["Dental crowns", "Bridges", "Dentures", "Root canals"],
    price: "From $500",
  },
];

const process = [
  { step: "01", title: "Book Online", desc: "Choose your service, dentist, and preferred time in minutes." },
  { step: "02", title: "Consultation", desc: "Meet your dentist for a thorough exam and personalized treatment plan." },
  { step: "03", title: "Treatment", desc: "Receive world-class care in our comfortable, modern clinic." },
  { step: "04", title: "Follow-Up", desc: "We check in to ensure you're healing well and smiling brighter." },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="section-tag mb-4">What We Offer</span>
          <h1 className="text-5xl font-bold mt-4 mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
            Complete Dental Services
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From routine prevention to complex restorations — every service delivered with expertise and genuine care.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <div key={s.title} className={`card-dental flex gap-6 animate-fade-up animate-delay-${(i % 4) * 100}`}>
                <div className="text-5xl flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-xl" style={{ color: "hsl(var(--foreground))" }}>{s.title}</h3>
                    <span className="text-sm font-semibold flex-shrink-0 px-3 py-1 rounded-full"
                      style={{ background: "hsl(var(--primary-light))", color: "hsl(var(--primary))" }}>
                      {s.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                  <ul className="grid grid-cols-2 gap-1.5 mb-4">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-foreground/75">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/book" className="inline-flex items-center gap-1 text-sm font-medium"
                    style={{ color: "hsl(var(--primary))" }}>
                    Book This Service <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20" style={{ background: "hsl(var(--secondary))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-tag mb-4">How It Works</span>
            <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
              Your Care Journey
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((p, i) => (
              <div key={p.step} className="text-center animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-white"
                  style={{ background: "var(--gradient-primary)", fontFamily: "'DM Serif Display', serif" }}>
                  {p.step}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "hsl(var(--foreground))" }}>{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
            style={{ background: "var(--gradient-primary)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "white", transform: "translate(30%, -30%)" }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "white", transform: "translate(-30%, 30%)" }} />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Ready to Get Started?
              </h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">
                Book your appointment today. Our friendly team will guide you to the right service for your needs.
              </p>
              <Link to="/book"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "white", color: "hsl(var(--primary))", boxShadow: "0 8px 25px hsl(0 0% 0% / 0.2)" }}>
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
