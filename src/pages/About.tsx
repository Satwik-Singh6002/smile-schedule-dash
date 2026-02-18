import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Clock, Heart, MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Dentist {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
}

const values = [
  { icon: <Heart className="w-6 h-6" />, title: "Patient-First Care", desc: "Every decision we make centers on your comfort, health, and happiness." },
  { icon: <Award className="w-6 h-6" />, title: "Clinical Excellence", desc: "Continuous education and cutting-edge techniques for the best outcomes." },
  { icon: <Users className="w-6 h-6" />, title: "Family Welcome", desc: "From toddlers to seniors, we treat every member of your family." },
  { icon: <Clock className="w-6 h-6" />, title: "Respect Your Time", desc: "On-time appointments, no long waits, because your time matters." },
];

const milestones = [
  { year: "2008", event: "DentaCare founded by Dr. Aisha Patel with a mission to make quality dental care accessible." },
  { year: "2012", event: "Expanded to our current state-of-the-art facility with 6 treatment rooms." },
  { year: "2016", event: "Introduced digital X-rays and 3D imaging for precise, radiation-safe diagnostics." },
  { year: "2020", event: "Launched online booking and teledentistry consultations for patient convenience." },
  { year: "2024", event: "Celebrated 5,000+ happy patients and opened our pediatric wing." },
];

export default function About() {
  const [dentists, setDentists] = useState<Dentist[]>([]);

  useEffect(() => {
    supabase.from("dentists").select("*").order("id").then(({ data }) => {
      setDentists(data || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="section-tag mb-4">Our Story</span>
          <h1 className="text-5xl font-bold mt-4 mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
            About DentaCare
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Since 2008, we've been transforming smiles and building lasting relationships with patients across New York.
            Our philosophy is simple: exceptional dentistry delivered with warmth and compassion.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10" style={{ background: "hsl(var(--primary))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[["5,000+", "Happy Patients"], ["15+", "Years of Experience"], ["98%", "Satisfaction Rate"], ["3", "Expert Dentists"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{val}</div>
                <div className="text-sm text-white/70 mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-tag mb-4">Our Mission</span>
              <h2 className="text-4xl font-bold mt-4 mb-6" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
                Dentistry That Puts You First
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At DentaCare, we believe that great dental care goes beyond just fixing teeth. It's about creating a 
                comfortable environment where patients feel heard, respected, and genuinely cared for.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our team combines decades of clinical experience with the latest technology to deliver results that 
                are not just beautiful, but built to last. From your first visit, you become part of our family.
              </p>
              <Link to="/book" className="btn-primary gap-2">
                Meet the Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="card-dental">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                    style={{ background: "var(--gradient-primary)" }}>
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-base mb-1" style={{ color: "hsl(var(--foreground))" }}>{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-24" style={{ background: "hsl(var(--secondary))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-tag mb-4">Our Team</span>
            <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
              Meet Our Dentists
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Experienced, compassionate professionals dedicated to your best smile.
            </p>
          </div>

          {dentists.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-dental animate-pulse">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-4 bg-muted rounded mx-auto w-32 mb-2" />
                  <div className="h-3 bg-muted rounded mx-auto w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dentists.map((d, i) => (
                <div key={d.id} className={`card-dental text-center animate-fade-up animate-delay-${i * 100}`}>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-5"
                    style={{ background: "var(--gradient-primary)", fontFamily: "'DM Serif Display', serif" }}>
                    {d.avatar}
                  </div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: "hsl(var(--foreground))", fontFamily: "'DM Serif Display', serif" }}>{d.name}</h3>
                  <p className="text-sm mb-4" style={{ color: "hsl(var(--primary))" }}>{d.specialty}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    A dedicated professional committed to providing the highest standard of dental care with a gentle, patient-centered approach.
                  </p>
                  <Link to="/book" className="btn-outline text-xs px-4 py-2">
                    Book with {d.name.split(" ")[1]}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-tag mb-4">Our Journey</span>
            <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
              15 Years of Smiles
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-0.5"
              style={{ background: "hsl(var(--border))" }} />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"} animate-fade-up`}
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="card-dental inline-block max-w-xs">
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm z-10"
                    style={{ background: "var(--gradient-primary)", fontFamily: "'DM Serif Display', serif" }}>
                    {m.year}
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Info */}
      <section className="py-20" style={{ background: "hsl(var(--secondary))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="card-dental">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                style={{ background: "var(--gradient-primary)" }}>
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "hsl(var(--foreground))" }}>Visit Us</h3>
              <p className="text-muted-foreground text-sm">123 Smile Street<br />New York, NY 10001</p>
            </div>
            <div className="card-dental">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                style={{ background: "var(--gradient-primary)" }}>
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "hsl(var(--foreground))" }}>Call Us</h3>
              <p className="text-muted-foreground text-sm">+1 (555) 234-5678<br />Mon–Sat: 8am – 6pm</p>
            </div>
            <div className="card-dental">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                style={{ background: "var(--gradient-primary)" }}>
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "hsl(var(--foreground))" }}>Email Us</h3>
              <p className="text-muted-foreground text-sm">hello@dentacare.com<br />We reply within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
