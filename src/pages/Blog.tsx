import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Loader2, AlertCircle } from "lucide-react";
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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data) setPosts(data as BlogPost[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-tag mb-4">Our Blog</span>
          <h1 className="text-5xl font-bold mt-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Dental Health Insights
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            Expert advice, tips, and news from our dental team to keep your smile at its best.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading articles...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-base font-medium">No published articles yet.</p>
              <p className="text-sm mt-1">Check back soon — our team is writing great content!</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <div className="card-dental mb-10 md:flex gap-8 items-center">
                  {/* Image or placeholder */}
                  <div
                    className="flex-shrink-0 w-full md:w-48 h-40 md:h-36 rounded-2xl overflow-hidden mb-4 md:mb-0"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    {featured.images && featured.images.length > 0 ? (
                      <img
                        src={featured.images[0]}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🦷</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="section-tag text-xs">{featured.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {Math.ceil((featured.content?.length ?? 0) / 800)} min read
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {featured.content?.slice(0, 140)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        By {featured.author} · {formatDate(featured.created_at)}
                      </span>
                      <Link to={`/blog/${featured.id}`} className="btn-primary text-xs px-4 py-2">
                        Read More <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post, i) => (
                    <div
                      key={post.id}
                      className={`card-dental flex flex-col animate-fade-up animate-delay-${(i % 3) * 100}`}
                    >
                      {/* Thumbnail */}
                      <div
                        className="w-full h-36 rounded-xl overflow-hidden mb-4"
                        style={{ background: "hsl(var(--secondary))" }}
                      >
                        {post.images && post.images.length > 0 ? (
                          <img
                            src={post.images[0]}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📄</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="section-tag text-xs">{post.category}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {Math.ceil((post.content?.length ?? 0) / 800)} min read
                        </span>
                      </div>
                      <h3 className="font-bold text-base mb-2 leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                        {post.content?.slice(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">{formatDate(post.created_at)}</span>
                        <Link
                          to={`/blog/${post.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium"
                          style={{ color: "hsl(var(--primary))" }}
                        >
                          Read <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
