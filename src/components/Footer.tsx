import { Link } from "react-router-dom";
import { Stethoscope, Phone, MapPin, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "hsl(210 25% 10%)", color: "hsl(210 15% 70%)" }} className="pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}>
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                DentaCare
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Modern dental care with a gentle touch. Your smile is our passion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[["Home", "/"], ["Book Appointment", "/book"], ["Blog", "/blog"], ["Admin", "/admin"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm">
              {["General Dentistry", "Teeth Whitening", "Orthodontics", "Dental Implants", "Emergency Care"].map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: "hsl(var(--primary-glow))" }} /> +1 (555) 234-5678</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: "hsl(var(--primary-glow))" }} /> hello@dentacare.com</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" style={{ color: "hsl(var(--primary-glow))" }} /> 123 Smile Street, New York, NY 10001</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: "hsl(var(--primary-glow))" }} /> Mon–Sat: 8am – 6pm</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 DentaCare. All rights reserved.</p>
          <p>Crafted with care for your brightest smile ✨</p>
        </div>
      </div>
    </footer>
  );
}
