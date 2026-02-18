import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Calendar, Users, FileText,
  LogOut, ChevronRight, Plus, Trash2, Edit, Check, X,
  Clock, CheckCircle, TrendingUp, Stethoscope, Menu, Loader2, AlertCircle,
  ImagePlus, ChevronLeft, ChevronRight as ChevronRightIcon
} from "lucide-react";
import AdminLogin from "./AdminLogin";
import { supabase } from "@/integrations/supabase/client";

// --- Types ---
type Appointment = {
  id: number; patient: string; patient_email: string | null;
  patient_phone: string | null; dentist: string; date: string;
  time: string; service: string; status: string; created_at: string;
};
type BlogPost = {
  id: number; title: string; category: string; author: string;
  content: string | null; published: boolean; created_at: string;
  images: string[] | null;
};
type Dentist = { id: number; name: string; specialty: string; avatar: string; };
type BlockedSlots = Record<string, Record<string, string[]>>;

const ALL_SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// --- Stat Card ---
function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="card-dental p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// --- Dashboard ---
function Dashboard({ appointments, loading }: { appointments: Appointment[]; loading: boolean }) {
  const pending = appointments.filter(a => a.status === "pending").length;
  const confirmed = appointments.filter(a => a.status === "confirmed").length;
  const today = appointments.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening at DentaCare today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-white" />} label="Total Appointments"
          value={loading ? "—" : String(appointments.length)} sub="All time" color="hsl(var(--primary))" />
        <StatCard icon={<Clock className="w-6 h-6 text-white" />} label="Pending"
          value={loading ? "—" : String(pending)} sub="Awaiting confirmation" color="hsl(38 92% 55%)" />
        <StatCard icon={<CheckCircle className="w-6 h-6 text-white" />} label="Confirmed"
          value={loading ? "—" : String(confirmed)} sub="Confirmed bookings" color="hsl(142 71% 45%)" />
        <StatCard icon={<TrendingUp className="w-6 h-6 text-white" />} label="Satisfaction"
          value="98%" sub="Based on 5-star reviews" color="hsl(262 80% 65%)" />
      </div>

      <div className="card-dental p-6">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Recent Appointments
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading appointments...
          </div>
        ) : today.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No appointments yet. They'll appear here once patients book.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {today.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "var(--gradient-primary)" }}>
                    {apt.patient[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{apt.patient}</p>
                    <p className="text-xs text-muted-foreground">{apt.dentist} · {apt.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{apt.time}</p>
                  <p className="text-xs text-muted-foreground">{apt.date}</p>
                </div>
                <span className={`ml-4 text-xs font-medium px-2.5 py-1 rounded-full ${
                  apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                  apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-600"}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Appointments Manager ---
function AppointmentsManager({ appointments, loading, onUpdateStatus }: {
  appointments: Appointment[];
  loading: boolean;
  onUpdateStatus: (id: number, status: string) => Promise<void>;
}) {
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const filtered = filter === "all" ? appointments : appointments.filter(a => a.status === filter);

  const handleUpdate = async (id: number, status: string) => {
    setUpdating(id);
    await onUpdateStatus(id, status);
    setUpdating(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Appointments</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage all patient appointments</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${filter === f ? "text-white" : "border border-border hover:border-primary/50"}`}
            style={{ background: filter === f ? "hsl(var(--primary))" : undefined }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-dental p-10 text-center text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No appointments found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(apt => (
            <div key={apt.id} className="card-dental p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ background: "var(--gradient-primary)" }}>
                  {apt.patient[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{apt.patient}</p>
                  <p className="text-xs text-muted-foreground">{apt.service}</p>
                  {apt.patient_email && <p className="text-xs text-muted-foreground">{apt.patient_email}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{apt.dentist}</span><span>·</span><span>{apt.date} {apt.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                  apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-600"}`}>
                  {apt.status}
                </span>
                {apt.status === "pending" && (
                  <>
                    <button onClick={() => handleUpdate(apt.id, "confirmed")} disabled={updating === apt.id}
                      className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50">
                      {updating === apt.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleUpdate(apt.id, "cancelled")} disabled={updating === apt.id}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Calendar & Slots Manager ---
function CalendarManager({ dentists }: { dentists: Dentist[] }) {
  const [selectedDentist, setSelectedDentist] = useState<number | null>(null);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlots>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (dentists.length > 0 && !selectedDentist) setSelectedDentist(dentists[0].id);
  }, [dentists]);

  useEffect(() => {
    fetchBlockedSlots();
  }, []);

  const fetchBlockedSlots = async () => {
    setLoading(true);
    const { data } = await supabase.from("blocked_slots").select("*");
    if (data) {
      const map: BlockedSlots = {};
      data.forEach(row => {
        const key = String(row.dentist_id);
        if (!map[key]) map[key] = {};
        if (!map[key][row.day]) map[key][row.day] = [];
        map[key][row.day].push(row.slot);
      });
      setBlockedSlots(map);
    }
    setLoading(false);
  };

  const toggleSlot = async (day: string, slot: string) => {
    if (!selectedDentist) return;
    const key = String(selectedDentist);
    const isBlocked = blockedSlots[key]?.[day]?.includes(slot);
    const toggleKey = `${day}-${slot}`;
    setToggling(toggleKey);

    if (isBlocked) {
      await supabase.from("blocked_slots").delete()
        .eq("dentist_id", selectedDentist).eq("day", day).eq("slot", slot);
      setBlockedSlots(prev => ({
        ...prev,
        [key]: { ...prev[key], [day]: (prev[key]?.[day] || []).filter(s => s !== slot) }
      }));
    } else {
      await supabase.from("blocked_slots").insert({ dentist_id: selectedDentist, day, slot });
      setBlockedSlots(prev => ({
        ...prev,
        [key]: { ...prev[key], [day]: [...(prev[key]?.[day] || []), slot] }
      }));
    }
    setToggling(null);
  };

  const dentist = dentists.find(d => d.id === selectedDentist);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Calendar & Slots</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage availability for each dentist</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {dentists.map(d => (
          <button key={d.id} onClick={() => setSelectedDentist(d.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${selectedDentist === d.id ? "text-white border-transparent" : "border-border hover:border-primary/50"}`}
            style={{ background: selectedDentist === d.id ? "hsl(var(--primary))" : undefined }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: selectedDentist === d.id ? "hsl(0 0% 100% / 0.2)" : "hsl(var(--secondary))", color: selectedDentist === d.id ? "white" : "hsl(var(--primary))" }}>
              {d.avatar}
            </div>
            {d.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading slots...
        </div>
      ) : dentist ? (
        <div className="card-dental p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "var(--gradient-primary)" }}>
              {dentist.avatar}
            </div>
            <div>
              <p className="font-semibold">{dentist.name}</p>
              <p className="text-xs text-muted-foreground">{dentist.specialty}</p>
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "hsl(var(--primary))" }} /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-red-200" /> Blocked
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4 w-24">Time</th>
                  {DAYS.map(day => (
                    <th key={day} className="text-center text-xs font-medium text-muted-foreground pb-3 px-2">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_SLOTS.map(slot => (
                  <tr key={slot} className="border-t border-border/50">
                    <td className="py-2 pr-4 text-xs font-medium text-muted-foreground">{slot}</td>
                    {DAYS.map(day => {
                      const isBlocked = blockedSlots[String(selectedDentist)]?.[day]?.includes(slot);
                      const isToggling = toggling === `${day}-${slot}`;
                      return (
                        <td key={day} className="py-2 px-2 text-center">
                          <button onClick={() => toggleSlot(day, slot)} disabled={isToggling}
                            className={`w-full rounded-lg py-1.5 text-xs font-medium transition-all duration-150 border disabled:opacity-60 ${
                              isBlocked
                                ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                : "border-border hover:border-primary/50 hover:bg-accent"
                            }`}
                            style={!isBlocked ? { color: "hsl(var(--primary))" } : undefined}>
                            {isToggling ? "..." : isBlocked ? "✕" : "✓"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Click any slot to toggle its availability. Red = blocked for patients.</p>
        </div>
      ) : null}
    </div>
  );
}

// --- Blog Manager ---
function BlogManager({ dentists }: { dentists: Dentist[] }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: "Oral Health", content: "" });
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewSlide, setPreviewSlide] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = ["Oral Health", "Patient Guide", "Cosmetic Dentistry", "Dental Implants", "Pediatric", "General"];
  const defaultAuthor = dentists[0]?.name || "Dr. Admin";

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
    setLoading(false);
  };

  const uploadImages = async (postId: number, files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `blog/${postId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
        urls.push(urlData.publicUrl);
      }
    }
    return urls;
  };

  const handleCreate = async () => {
    if (!newPost.title.trim()) return;
    setSaving(true);
    // Insert post first to get id
    const { data } = await supabase.from("blog_posts").insert({
      title: newPost.title,
      category: newPost.category,
      author: defaultAuthor,
      content: newPost.content,
      published: false,
      images: [],
    }).select().single();

    if (data) {
      let finalPost = data as BlogPost;
      if (pendingImages.length > 0) {
        setUploadingImages(true);
        const urls = await uploadImages(data.id, pendingImages);
        if (urls.length > 0) {
          const { data: updated } = await supabase
            .from("blog_posts")
            .update({ images: urls })
            .eq("id", data.id)
            .select()
            .single();
          if (updated) finalPost = updated as BlogPost;
        }
        setUploadingImages(false);
      }
      setPosts(prev => [finalPost, ...prev]);
    }
    setCreating(false);
    setNewPost({ title: "", category: "Oral Health", content: "" });
    setPendingImages([]);
    setPreviewSlide(0);
    setSaving(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPendingImages(prev => {
      const combined = [...prev, ...files];
      return combined.slice(0, 10); // max 10 images
    });
    setPreviewSlide(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePreviewImage = (idx: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== idx));
    setPreviewSlide(s => Math.max(0, s - (idx <= s ? 1 : 0)));
  };

  const togglePublish = async (id: number, current: boolean) => {
    const { data } = await supabase.from("blog_posts").update({ published: !current }).eq("id", id).select().single();
    if (data) setPosts(prev => prev.map(p => p.id === id ? data as BlogPost : p));
  };

  const deletePost = async (id: number) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Blog Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Create and manage your dental health articles</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {creating && (
        <div className="card-dental p-6 animate-scale-in border-2" style={{ borderColor: "hsl(var(--primary) / 0.3)" }}>
          <h3 className="font-bold mb-5 flex items-center gap-2">
            <Edit className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} /> New Blog Post
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Post Title *</label>
              <input className="input-dental" placeholder="Enter a compelling title..."
                value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="input-dental" value={newPost.category}
                onChange={e => setNewPost({ ...newPost, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea className="input-dental min-h-[140px] resize-y" placeholder="Write your article content here..."
                value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Images <span className="text-muted-foreground font-normal">(optional, up to 10)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed text-sm font-medium transition-all duration-200 hover:border-primary/60"
                style={{ borderColor: "hsl(var(--primary) / 0.4)", color: "hsl(var(--primary))" }}
              >
                <ImagePlus className="w-4 h-4" /> Add Images
              </button>

              {/* Image preview slider */}
              {pendingImages.length > 0 && (
                <div className="mt-3 relative rounded-xl overflow-hidden" style={{ height: 180 }}>
                  <img
                    src={URL.createObjectURL(pendingImages[previewSlide])}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Remove button */}
                  <button
                    onClick={() => removePreviewImage(previewSlide)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-red-500 text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {/* Prev/Next */}
                  {pendingImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setPreviewSlide(s => (s - 1 + pendingImages.length) % pendingImages.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "hsl(var(--card) / 0.85)" }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPreviewSlide(s => (s + 1) % pendingImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "hsl(var(--card) / 0.85)" }}
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {pendingImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPreviewSlide(i)}
                        className="rounded-full transition-all duration-200"
                        style={{
                          width: i === previewSlide ? 16 : 6,
                          height: 6,
                          background: i === previewSlide ? "hsl(var(--primary))" : "hsl(var(--card) / 0.7)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "hsl(var(--card) / 0.85)" }}>
                    {previewSlide + 1}/{pendingImages.length}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={handleCreate} className="btn-primary text-sm" disabled={!newPost.title.trim() || saving || uploadingImages}>
                {(saving || uploadingImages) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {uploadingImages ? "Uploading images..." : saving ? "Saving..." : "Save as Draft"}
              </button>
              <button onClick={() => { setCreating(false); setPendingImages([]); setPreviewSlide(0); }} className="btn-outline text-sm">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div className="card-dental p-10 text-center text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No blog posts yet. Click "New Post" to create your first article.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="card-dental p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {post.images && post.images.length > 0 ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "hsl(var(--secondary))" }}>📄</div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="section-tag text-xs">{post.category}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    {post.images && post.images.length > 0 && (
                      <span className="text-xs text-muted-foreground">📷 {post.images.length}</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm truncate">{post.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    By {post.author} · {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(post.id, post.published)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                    post.published
                      ? "border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100"
                      : "border-green-200 text-green-600 bg-green-50 hover:bg-green-100"
                  }`}>
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => deletePost(post.id)}
                  className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Nav Items ---
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "appointments", label: "Appointments", icon: <Users className="w-4 h-4" /> },
  { id: "calendar", label: "Calendar & Slots", icon: <Calendar className="w-4 h-4" /> },
  { id: "blog", label: "Blog", icon: <FileText className="w-4 h-4" /> },
];

// --- Main Admin Dashboard ---
export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingDentists, setLoadingDentists] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) checkAdminRole(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) checkAdminRole(session.user.id);
      else setLoggedIn(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (data) setLoggedIn(true);
  };

  useEffect(() => {
    if (!loggedIn) return;
    fetchAppointments();
    fetchDentists();
  }, [loggedIn]);

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
    if (data) setAppointments(data);
    setLoadingAppointments(false);
  };

  const fetchDentists = async () => {
    setLoadingDentists(true);
    const { data } = await supabase.from("dentists").select("*").order("id");
    if (data) setDentists(data);
    setLoadingDentists(false);
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    const { data } = await supabase.from("appointments").update({ status }).eq("id", id).select().single();
    if (data) setAppointments(prev => prev.map(a => a.id === id ? data : a));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(var(--muted))" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex-shrink-0 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "hsl(var(--card))", borderRight: "1px solid hsl(var(--border))" }}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>DentaCare</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`admin-sidebar-link w-full ${activeTab === item.id ? "active" : ""}`}>
              {item.icon}
              <span>{item.label}</span>
              {activeTab !== item.id && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout}
            className="admin-sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="border-b border-border px-6 py-4 flex items-center justify-between"
          style={{ background: "hsl(var(--card))" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-base capitalize">{activeTab.replace("-", " & ")}</h1>
              <p className="text-xs text-muted-foreground">DentaCare Admin</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "var(--gradient-primary)" }}>
            AD
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {activeTab === "dashboard" && <Dashboard appointments={appointments} loading={loadingAppointments} />}
          {activeTab === "appointments" && (
            <AppointmentsManager
              appointments={appointments}
              loading={loadingAppointments}
              onUpdateStatus={updateAppointmentStatus}
            />
          )}
          {activeTab === "calendar" && <CalendarManager dentists={loadingDentists ? [] : dentists} />}
          {activeTab === "blog" && <BlogManager dentists={loadingDentists ? [] : dentists} />}
        </main>
      </div>
    </div>
  );
}
