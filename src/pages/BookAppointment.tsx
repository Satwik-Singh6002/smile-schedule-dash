import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, User, ChevronLeft, ChevronRight, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const services = [
  "General Checkup", "Teeth Cleaning", "Teeth Whitening", "Fillings",
  "Root Canal", "Orthodontic Consultation", "Dental Implant Consultation", "Emergency Care",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Dentist = { id: number; name: string; specialty: string; avatar: string; rating?: number; reviews?: number; };

function CalendarPicker({ selected, onChange }: { selected: Date | null; onChange: (d: Date) => void }) {
  const [view, setView] = useState(() => {
    const d = new Date();
    return { month: d.getMonth(), year: d.getFullYear() };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const prev = () => {
    if (view.month === 0) setView({ month: 11, year: view.year - 1 });
    else setView({ ...view, month: view.month - 1 });
  };
  const next = () => {
    if (view.month === 11) setView({ month: 0, year: view.year + 1 });
    else setView({ ...view, month: view.month + 1 });
  };

  return (
    <div className="rounded-2xl border border-border p-4" style={{ background: "hsl(var(--card))" }}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm">{MONTHS[view.month]} {view.year}</span>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs font-medium py-1" style={{ color: "hsl(var(--muted-foreground))" }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(view.year, view.month, day);
          const isPast = date < today;
          const isSelected = selected?.toDateString() === date.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <button
              key={day}
              disabled={isPast || isWeekend}
              onClick={() => onChange(date)}
              className={`h-8 w-8 mx-auto rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center
                ${isPast || isWeekend ? "opacity-30 cursor-not-allowed" : "hover:bg-accent cursor-pointer"}
                ${isSelected ? "text-white" : ""}
                ${isToday && !isSelected ? "border font-bold" : ""}
              `}
              style={{
                background: isSelected ? "hsl(var(--primary))" : undefined,
                borderColor: isToday ? "hsl(var(--primary))" : undefined,
                color: isSelected ? "white" : isToday ? "hsl(var(--primary))" : undefined,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loadingDentists, setLoadingDentists] = useState(true);
  const [selectedDentist, setSelectedDentist] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch dentists on mount
  useEffect(() => {
    const fetchDentists = async () => {
      const { data, error } = await supabase.from("dentists").select("*").order("id");
      if (error) {
        console.error("Error fetching dentists:", error);
      } else {
        setDentists(data || []);
      }
      setLoadingDentists(false);
    };
    fetchDentists();
  }, []);

  // Fetch blocked slots + already-booked appointments when dentist or date changes
  // Also subscribes to real-time changes so admin slot updates reflect immediately
  useEffect(() => {
    if (!selectedDentist || !selectedDate) {
      setBookedSlots([]);
      return;
    }

    const dayName = DAYS[selectedDate.getDay()];
    const dentistObj = dentists.find(d => d.id === selectedDentist);
    const dateString = selectedDate.toDateString();

    const fetchUnavailableSlots = async () => {
      setLoadingSlots(true);
      const [blockedRes, appointmentsRes] = await Promise.all([
        supabase
          .from("blocked_slots")
          .select("slot")
          .eq("dentist_id", selectedDentist)
          .eq("day", dayName),
        supabase
          .from("appointments")
          .select("time")
          .eq("dentist", dentistObj?.name ?? "")
          .eq("date", dateString)
          .in("status", ["pending", "confirmed"]),
      ]);
      const blocked = (blockedRes.data || []).map((r: { slot: string }) => r.slot);
      const booked = (appointmentsRes.data || []).map((r: { time: string }) => r.time);
      setBookedSlots(Array.from(new Set([...blocked, ...booked])));
      setLoadingSlots(false);
    };

    fetchUnavailableSlots();

    // Real-time: re-fetch whenever admin blocks/unblocks slots
    const channel = supabase
      .channel(`booking_slots_${selectedDentist}_${dayName}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "blocked_slots" }, () => {
        fetchUnavailableSlots();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedDentist, selectedDate, dentists]);

  const canNext = () => {
    if (step === 1) return selectedDentist !== null;
    if (step === 2) return selectedDate !== null && selectedSlot !== null;
    if (step === 3) return selectedService !== "";
    if (step === 4) return form.name !== "" && form.email !== "" && form.phone !== "";
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canNext()) return;

    const dentist = dentists.find(d => d.id === selectedDentist);
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("appointments").insert({
      patient: form.name,
      patient_email: form.email,
      patient_phone: form.phone,
      dentist: dentist?.name ?? "",
      date: selectedDate?.toDateString() ?? "",
      time: selectedSlot ?? "",
      service: selectedService,
      status: "pending",
    });

    if (error) {
      console.error("Error booking appointment:", error);
      setSubmitError("Failed to book appointment. Please try again.");
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const dentist = dentists.find(d => d.id === selectedDentist);

  const steps = ["Choose Dentist", "Pick Date & Time", "Select Service", "Your Details"];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="text-center animate-scale-in max-w-md">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "hsl(var(--primary-light))" }}>
              <CheckCircle className="w-10 h-10" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Appointment Booked!</h2>
            <p className="text-muted-foreground mb-2">
              Your appointment with <strong>{dentist?.name}</strong> has been confirmed.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {selectedDate?.toDateString()} at {selectedSlot} · {selectedService}
            </p>
            <div className="p-6 rounded-2xl mb-8 text-left" style={{ background: "hsl(var(--secondary))" }}>
              <p className="text-sm font-medium mb-1">Confirmation will be sent to:</p>
              <p className="text-sm text-muted-foreground">{form.email}</p>
            </div>
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-tag mb-3">Online Booking</span>
          <h1 className="text-4xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Book Your Appointment</h1>
          <p className="text-muted-foreground mt-3">Simple, fast, and convenient scheduling in just a few steps.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${step > i + 1 ? "text-white" : step === i + 1 ? "text-white" : "text-muted-foreground"}`}
                  style={{
                    background: step > i + 1 ? "hsl(var(--primary))" : step === i + 1 ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    boxShadow: step === i + 1 ? "0 0 0 4px hsl(var(--primary) / 0.2)" : undefined,
                  }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-1.5 hidden sm:block font-medium ${step === i + 1 ? "" : "text-muted-foreground"}`}
                  style={{ color: step === i + 1 ? "hsl(var(--primary))" : undefined }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-all duration-300"
                  style={{ background: step > i + 1 ? "hsl(var(--primary))" : "hsl(var(--border))" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="animate-fade-in">
          {/* Step 1: Choose Dentist */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Choose Your Dentist
              </h3>
              {loadingDentists ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading dentists...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {dentists.map(d => (
                    <button key={d.id} onClick={() => setSelectedDentist(d.id)}
                      className={`card-dental text-left transition-all duration-200`}
                      style={{ outline: selectedDentist === d.id ? `2px solid hsl(var(--primary))` : undefined }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4"
                        style={{ background: "var(--gradient-primary)" }}>
                        {d.avatar}
                      </div>
                      <h4 className="font-bold text-base">{d.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">{d.specialty}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Pick a Date & Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-3 text-muted-foreground">Select Date (Weekdays only)</p>
                  <CalendarPicker selected={selectedDate} onChange={(d) => { setSelectedDate(d); setSelectedSlot(null); }} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-muted-foreground">
                    {selectedDate ? `Available Slots — ${selectedDate.toDateString()}` : "Select a date first"}
                  </p>
                  {selectedDate && (
                    loadingSlots ? (
                      <div className="flex items-center gap-2 text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading slots...
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(slot => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot)}
                              className={`slot-btn ${isSelected ? "selected" : ""} ${isBooked ? "booked" : ""}`}>
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    )
                  )}
                  {selectedDate && !loadingSlots && (
                    <p className="text-xs text-muted-foreground mt-3">
                      <span className="inline-block w-3 h-3 rounded-sm bg-muted mr-1" /> = Unavailable (blocked or already booked)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Service */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Select Service
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {services.map(s => (
                  <button key={s} onClick={() => setSelectedService(s)}
                    className={`rounded-xl border p-3 text-sm font-medium text-left transition-all duration-200 ${selectedService === s ? "border-primary text-primary" : "border-border hover:border-primary/50"}`}
                    style={{
                      background: selectedService === s ? "hsl(var(--primary-light))" : "hsl(var(--card))",
                      color: selectedService === s ? "hsl(var(--primary))" : undefined,
                      borderColor: selectedService === s ? "hsl(var(--primary))" : undefined,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Personal Details */}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-semibold mb-6">Your Details</h3>

              {/* Booking summary */}
              <div className="rounded-2xl p-5 mb-6 text-sm" style={{ background: "hsl(var(--secondary))" }}>
                <p className="font-semibold mb-3">Appointment Summary</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>Dentist:</span><span className="font-medium text-foreground">{dentist?.name}</span>
                  <span>Date:</span><span className="font-medium text-foreground">{selectedDate?.toDateString()}</span>
                  <span>Time:</span><span className="font-medium text-foreground">{selectedSlot}</span>
                  <span>Service:</span><span className="font-medium text-foreground">{selectedService}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input className="input-dental" value={form.name} placeholder="Jane Smith"
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input className="input-dental" type="email" value={form.email} placeholder="jane@email.com"
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input className="input-dental" value={form.phone} placeholder="+1 (555) 000-0000"
                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                  <input className="input-dental" value={form.notes} placeholder="Any concerns or notes..."
                    onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl text-sm" style={{ background: "hsl(0 85% 97%)", color: "hsl(0 72% 51%)" }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {submitError}
                </div>
              )}

              <button type="submit" className="btn-primary w-full mt-6" disabled={!canNext() || submitting}>
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                ) : (
                  <>Confirm Appointment <CheckCircle className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn-outline disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary disabled:opacity-40">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        {step === 4 && (
          <button onClick={() => setStep(3)} className="btn-outline mt-4">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
}
