import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type BlogPost = {
  id: number;
  title: string;
  category: string;
  author: string;
  content: string | null;
  published: boolean;
  created_at: string;
  images: string[] | null;
};

function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="w-full rounded-2xl overflow-hidden mb-10" style={{ maxHeight: 420 }}>
        <img src={images[0]} alt="Blog post" className="w-full h-full object-cover" style={{ maxHeight: 420 }} />
      </div>
    );
  }

  return (
    <div className="relative mb-10 rounded-2xl overflow-hidden" style={{ maxHeight: 420 }}>
      <img
        src={images[current]}
        alt={`Slide ${current + 1}`}
        className="w-full object-cover transition-all duration-500"
        style={{ maxHeight: 420, minHeight: 220 }}
      />

      {/* Prev / Next */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: "hsl(var(--card) / 0.9)", color: "hsl(var(--foreground))", boxShadow: "var(--shadow-md)" }}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % images.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: "hsl(var(--card) / 0.9)", color: "hsl(var(--foreground))", boxShadow: "var(--shadow-md)" }}
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              background: i === current ? "hsl(var(--primary))" : "hsl(var(--card) / 0.7)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <span
        className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
        style={{ background: "hsl(var(--card) / 0.85)", color: "hsl(var(--foreground))" }}
      >
        {current + 1} / {images.length}
      </span>
    </div>
  );
}

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", Number(id))
        .eq("published", true)
        .maybeSingle();

      if (!data || error) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPost(data as BlogPost);

      // Fetch related posts (same category, published, not same id)
      const { data: relatedData } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(2);

      if (relatedData) setRelated(relatedData as BlogPost[]);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 animate-spin"
          style={{ borderColor: "hsl(var(--primary) / 0.2)", borderTopColor: "hsl(var(--primary))" }} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const images = post.images ?? [];
  const readTime = Math.max(1, Math.ceil((post.content?.length ?? 0) / 800));
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const paragraphs = post.content
    ? post.content.split(". ").reduce((acc: string[][], sentence, i) => {
        if (i % 4 === 0) acc.push([]);
        acc[acc.length - 1].push(sentence);
        return acc;
      }, [])
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <span className="section-tag mb-4 inline-block">{post.category}</span>

        <h1 className="text-4xl font-bold mt-4 mb-6 leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--gradient-primary)" }}
            >
              {post.author.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {formatDate(post.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {readTime} min read
          </span>
        </div>

        {/* Image slider */}
        {images.length > 0 && <ImageSlider images={images} />}

        {/* Content */}
        <div className="prose max-w-none">
          <div className="text-base leading-8 text-foreground/85 space-y-4">
            {paragraphs.map((group, i) => (
              <p key={i}>{group.join(". ")}.</p>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl text-center" style={{ background: "hsl(var(--secondary))" }}>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ready to put this advice into action?
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Book an appointment with one of our expert dentists today.
          </p>
          <Link to="/book" className="btn-primary">Book Appointment</Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(p => (
                <Link key={p.id} to={`/blog/${p.id}`} className="card-dental block">
                  {p.images && p.images.length > 0 ? (
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-2xl mb-2">📄</div>
                  )}
                  <h4 className="font-bold mb-1 text-sm">{p.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {Math.max(1, Math.ceil((p.content?.length ?? 0) / 800))} min read ·{" "}
                    {formatDate(p.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
