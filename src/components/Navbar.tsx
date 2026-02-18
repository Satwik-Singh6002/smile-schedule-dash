import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Stethoscope } from "lucide-react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/#services" },
  { label: "Book Appointment", to: "/book" },
  { label: "Blog", to: "/blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-soft"
              style={{ background: "var(--gradient-primary)" }}>
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--primary))" }}>
              DentaCare
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link ${location.pathname === item.to ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA + Admin */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin" className="nav-link text-xs uppercase tracking-wider">
              Admin
            </Link>
            <Link to="/book" className="btn-primary text-xs px-5 py-2.5">
              Book Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "hsl(var(--foreground))" }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "hsl(var(--foreground) / 0.8)" }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: "hsl(var(--muted-foreground))" }}
              onClick={() => setOpen(false)}>
              Admin Portal
            </Link>
            <Link to="/book" className="btn-primary text-center" onClick={() => setOpen(false)}>
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
