import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ImageIcon } from "lucide-react";

interface GalleryImage {
  id: number;
  url: string;
  caption: string | null;
  created_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();

    const channel = supabase
      .channel("gallery_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_images" }, fetchImages)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    setImages(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="section-tag mb-4">Our Clinic</span>
          <h1 className="text-5xl font-bold mt-4 mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: "hsl(var(--foreground))" }}>
            Clinic Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Take a virtual tour of our modern facilities, treatment rooms, and the smiles we've transformed.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-24">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-muted-foreground text-lg font-medium">No images yet</p>
              <p className="text-muted-foreground text-sm mt-1">The admin can upload gallery images from the dashboard.</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="break-inside-avoid cursor-pointer group overflow-hidden rounded-2xl border border-border"
                  style={{ boxShadow: "var(--shadow-card)" }}
                  onClick={() => setSelected(img)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.caption || "Gallery image"}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {img.caption && (
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 flex items-end">
                        <p className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-white text-sm font-medium px-4 py-3 w-full">
                          {img.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "hsl(210 25% 10% / 0.92)" }}
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <img src={selected.url} alt={selected.caption || ""} className="w-full rounded-2xl object-contain max-h-[80vh]" />
            {selected.caption && (
              <p className="text-center text-white/80 mt-4 text-sm">{selected.caption}</p>
            )}
            <button
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-foreground flex items-center justify-center font-bold text-lg hover:scale-110 transition-transform"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
