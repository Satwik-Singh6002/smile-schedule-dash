import { useState } from "react";
import {
  LayoutDashboard, Calendar, Users, FileText, Settings,
  LogOut, ChevronRight, Plus, Trash2, Edit, Check, X,
  Clock, CheckCircle, AlertCircle, TrendingUp, Stethoscope, Menu
} from "lucide-react";
import AdminLogin from "./AdminLogin";

// --- Mock Data ---
const DENTISTS = [
  { id: 1, name: "Dr. Aisha Patel", specialty: "General & Cosmetics", avatar: "AP" },
  { id: 2, name: "Dr. James Morrison", specialty: "Orthodontics", avatar: "JM" },
  { id: 3, name: "Dr. Lisa Chen", specialty: "Pediatric Dentistry", avatar: "LC" },
];

const ALL_SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const initialAppointments = [
  { id: 1, patient: "Sarah Johnson", dentist: "Dr. Aisha Patel", date: "Mon, Dec 18", time: "09:00 AM", service: "Teeth Whitening", status: "confirmed" },
  { id: 2, patient: "Michael Chen", dentist: "Dr. James Morrison", date: "Mon, Dec 18", time: "10:30 AM", service: "Orthodontic Consultation", status: "pending" },
  { id: 3, patient: "Emma Davis", dentist: "Dr. Lisa Chen", date: "Tue, Dec 19", time: "02:00 PM", service: "Pediatric Checkup", status: "confirmed" },
  { id: 4, patient: "Robert Kim", dentist: "Dr. Aisha Patel", date: "Wed, Dec 20", time: "11:00 AM", service: "Dental Implant Consultation", status: "confirmed" },
  { id: 5, patient: "Linda Park", dentist: "Dr. James Morrison", date: "Thu, Dec 21", time: "03:30 PM", service: "Braces Adjustment", status: "cancelled" },
  { id: 6, patient: "James Wilson", dentist: "Dr. Lisa Chen", date: "Fri, Dec 22", time: "09:30 AM", service: "General Checkup", status: "pending" },
];

const initialBlogPosts = [
  { id: 1, title: "10 Tips for Maintaining a Healthy Smile at Home", category: "Oral Health", author: "Dr. Aisha Patel", date: "Dec 18, 2024", published: true },
  { id: 2, title: "What to Expect During Your First Dental Visit", category: "Patient Guide", author: "Dr. James Morrison", date: "Dec 12, 2024", published: true },
  { id: 3, title: "Teeth Whitening: Professional vs At-Home Treatments", category: "Cosmetic Dentistry", author: "Dr. Aisha Patel", date: "Dec 5, 2024", published: false },
];

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
function Dashboard({ appointments }: { appointments: typeof initialAppointments }) {
  const pending = appointments.filter(a => a.status === "pending").length;
  const confirmed = appointments.filter(a => a.status === "confirmed").length;
  const today = appointments.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening at DentaCare today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-white" />} label="Total Appointments"
          value={String(appointments.length)} sub="+3 this week" color="hsl(var(--primary))" />
        <StatCard icon={<Clock className="w-6 h-6 text-white" />} label="Pending"
          value={String(pending)} sub="Awaiting confirmation" color="hsl(38 92% 55%)" />
        <StatCard icon={<CheckCircle className="w-6 h-6 text-white" />} label="Confirmed"
          value={String(confirmed)} sub="Ready for tomorrow" color="hsl(142 71% 45%)" />
        <StatCard icon={<TrendingUp className="w-6 h-6 text-white" />} label="Satisfaction"
          value="98%" sub="Based on 5-star reviews" color="hsl(262 80% 65%)" />
      </div>

      {/* Today's appointments */}
      <div className="card-dental p-6">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> Upcoming Appointments
        </h3>
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
      </div>
    </div>
  );
}

// --- Appointments Manager ---
function AppointmentsManager({ appointments, setAppointments }: {
  appointments: typeof initialAppointments;
  setAppointments: React.Dispatch<React.SetStateAction<typeof initialAppointments>>;
}) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? appointments : appointments.filter(a => a.status === filter);

  const updateStatus = (id: number, status: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Appointments</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage all patient appointments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${filter === f ? "text-white" : "border border-border hover:border-primary/50"}`}
            style={{ background: filter === f ? "hsl(var(--primary))" : undefined }}>
            {f}
          </button>
        ))}
      </div>

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
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{apt.dentist}</span>
              <span>·</span>
              <span>{apt.date} {apt.time}</span>
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
                  <button onClick={() => updateStatus(apt.id, "confirmed")}
                    className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => updateStatus(apt.id, "cancelled")}
                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Calendar & Slots Manager ---
function CalendarManager() {
  const [selectedDentist, setSelectedDentist] = useState(1);
  const [blockedSlots, setBlockedSlots] = useState<Record<string, Record<string, string[]>>>({
    "1": { "Mon": ["09:30 AM", "11:00 AM"], "Wed": ["02:00 PM"] },
    "2": { "Tue": ["10:00 AM"] },
    "3": { "Fri": ["09:00 AM", "11:30 AM"] },
  });

  const toggleSlot = (day: string, slot: string) => {
    const key = String(selectedDentist);
    const current = blockedSlots[key]?.[day] || [];
    const isBlocked = current.includes(slot);
    setBlockedSlots(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [day]: isBlocked ? current.filter(s => s !== slot) : [...current, slot],
      }
    }));
  };

  const dentist = DENTISTS.find(d => d.id === selectedDentist)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Calendar & Slots</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage availability for each dentist</p>
      </div>

      {/* Dentist selector */}
      <div className="flex gap-3 flex-wrap">
        {DENTISTS.map(d => (
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
                    return (
                      <td key={day} className="py-2 px-2 text-center">
                        <button
                          onClick={() => toggleSlot(day, slot)}
                          className={`w-full rounded-lg py-1.5 text-xs font-medium transition-all duration-150 border ${
                            isBlocked
                              ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                              : "border-border hover:border-primary/50 hover:bg-accent"
                          }`}
                          style={!isBlocked ? { color: "hsl(var(--primary))" } : undefined}
                          title={isBlocked ? "Click to unblock" : "Click to block"}
                        >
                          {isBlocked ? "✕" : "✓"}
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
    </div>
  );
}

// --- Blog Manager ---
function BlogManager() {
  const [posts, setPosts] = useState(initialBlogPosts);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: "Oral Health", content: "" });

  const categories = ["Oral Health", "Patient Guide", "Cosmetic Dentistry", "Dental Implants", "Pediatric", "General"];

  const handleCreate = () => {
    if (!newPost.title.trim()) return;
    setPosts(prev => [{
      id: Date.now(),
      title: newPost.title,
      category: newPost.category,
      author: "Dr. Aisha Patel",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      published: false,
    }, ...prev]);
    setCreating(false);
    setNewPost({ title: "", category: "Oral Health", content: "" });
  };

  const togglePublish = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  const deletePost = (id: number) => {
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

      {/* Create form */}
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
            <div className="flex gap-3">
              <button onClick={handleCreate} className="btn-primary text-sm" disabled={!newPost.title.trim()}>
                <Check className="w-4 h-4" /> Save as Draft
              </button>
              <button onClick={() => setCreating(false)} className="btn-outline text-sm">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="card-dental p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="section-tag text-xs">{post.category}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <h4 className="font-semibold text-sm truncate">{post.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">By {post.author} · {post.date}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => togglePublish(post.id)}
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
    </div>
  );
}

// --- Main Admin Dashboard ---
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "appointments", label: "Appointments", icon: <Users className="w-4 h-4" /> },
  { id: "calendar", label: "Calendar & Slots", icon: <Calendar className="w-4 h-4" /> },
  { id: "blog", label: "Blog", icon: <FileText className="w-4 h-4" /> },
];

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(var(--muted))" }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
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
          <button onClick={() => setLoggedIn(false)}
            className="admin-sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--gradient-primary)" }}>
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {activeTab === "dashboard" && <Dashboard appointments={appointments} />}
          {activeTab === "appointments" && <AppointmentsManager appointments={appointments} setAppointments={setAppointments} />}
          {activeTab === "calendar" && <CalendarManager />}
          {activeTab === "blog" && <BlogManager />}
        </main>
      </div>
    </div>
  );
}
