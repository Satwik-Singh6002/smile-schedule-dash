import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Clock, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-dental.jpg";

const services = [
  { icon: "🦷", title: "General Dentistry", desc: "Comprehensive checkups, cleanings, and preventive care for the whole family." },
  { icon: "✨", title: "Teeth Whitening", desc: "Professional whitening treatments to brighten your smile by up to 8 shades." },
  { icon: "🔬", title: "Orthodontics", desc: "Braces and clear aligners to straighten your teeth comfortably." },
  { icon: "🏥", title: "Dental Implants", desc: "Permanent tooth replacement solutions that look and feel natural." },
  { icon: "🚨", title: "Emergency Care", desc: "Same-day emergency appointments for urgent dental issues." },
  { icon: "👶", title: "Pediatric Dentistry", desc: "Gentle, fun dental care designed specifically for children." },
];

const stats = [
  { value: "5,000+", label: "Happy Patients" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "3", label: "Expert Dentists" },
];

const testimonials = [
  { name: "Sarah Johnson", text: "The best dental experience I've ever had! Dr. Smith is so gentle and professional.", rating: 5, role: "Patient since 2021" },
  { name: "Michael Chen", text: "My teeth whitening results are incredible. Everyone keeps asking about my smile!", rating: 5, role: "Patient since 2022" },
  { name: "Emily Davis", text: "I used to be afraid of dentists, but the whole team made me feel completely at ease.", rating: 5, role: "Patient since 2023" },
];

const whyUs = [
  { icon: <Shield className="w-5 h-5" />, title: "Safe & Sterile", desc: "Highest hygiene standards" },
  { icon: <Clock className="w-5 h-5" />, title: "On-Time Care", desc: "We respect your schedule" },
  { icon: <Heart className="w-5 h-5" />, title: "Gentle Approach", desc: "Painless treatment focus" },
  { icon: <Star className="w-5 h-5" />, title: "5-Star Rated", desc: "Loved by thousands" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Dental clinic" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(175 65% 15% / 0.75) 0%, hsl(210 25% 10% / 0.5) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-up"
              style={{ background: "hsl(175 65% 38% / 0.25)", color: "hsl(175 65% 75%)", border: "1px solid hsl(175 65% 38% / 0.4)" }}>
              ✨ Trusted Dental Care Since 2008
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-up animate-delay-100"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Your Perfect<br />
              <span style={{ color: "hsl(175 65% 65%)" }}>Smile Starts</span><br />
              Here
            </h1>

            <p className="text-lg text-white/75 mb-10 leading-relaxed animate-fade-up animate-delay-200">
              Modern, gentle dental care tailored to you. From routine cleanings to complete smile makeovers — we make every visit comfortable.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up animate-delay-300">
              <Link to="/book" className="btn-primary gap-2">
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10">
                Our Services
              </a>
            </div>

            {/* Mini stats */}
            <div className="mt-16 flex flex-wrap gap-8 animate-fade-up animate-delay-400">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>{s.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12" style={{ background: "hsl(var(--primary))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyUs.map(item => (
              <div key={item.title} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(0 0% 100% / 0.15)" }}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-white/65">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-tag mb-4">Our Services</span>
            <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
              Complete Dental Care
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From prevention to restoration, we offer a full range of dental services to keep your smile healthy and beautiful.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.title} className={`card-dental animate-fade-up animate-delay-${(i % 4) * 100}`}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "hsl(var(--foreground))" }}>{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <Link to="/book" className="inline-flex items-center gap-1 text-sm font-medium mt-4"
                  style={{ color: "hsl(var(--primary))" }}>
                  Book Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" style={{ background: "hsl(var(--secondary))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-tag mb-4">Testimonials</span>
            <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
              What Our Patients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`card-dental animate-fade-up animate-delay-${i * 100}`}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: "hsl(38 92% 55%)" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "var(--gradient-primary)" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
            style={{ background: "var(--gradient-primary)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: "white", transform: "translate(30%, -30%)" }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
              style={{ background: "white", transform: "translate(-30%, 30%)" }} />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Ready for a Brighter Smile?
              </h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">
                Book your appointment today and take the first step toward the smile you've always wanted.
              </p>
              <Link to="/book"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "white", color: "hsl(var(--primary))", boxShadow: "0 8px 25px hsl(0 0% 0% / 0.2)" }}>
                Book Your Appointment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
