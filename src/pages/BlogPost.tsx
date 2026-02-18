import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "./Blog";

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const related = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          style={{ color: "hsl(var(--muted-foreground))" }}>
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-8"
          style={{ background: "hsl(var(--secondary))" }}>
          {post.image}
        </div>

        <span className="section-tag mb-4 inline-block">{post.category}</span>

        <h1 className="text-4xl font-bold mt-4 mb-6 leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--gradient-primary)" }}>
              {post.author.split(" ").map(n => n[0]).join("").slice(1, 3)}
            </div>
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
        </div>

        <div className="prose max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium">{post.excerpt}</p>
          <div className="text-base leading-8 text-foreground/85 space-y-4">
            {post.content.split(". ").reduce((acc: string[][], sentence, i) => {
              if (i % 4 === 0) acc.push([]);
              acc[acc.length - 1].push(sentence);
              return acc;
            }, []).map((group, i) => (
              <p key={i}>{group.join(". ")}.</p>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl text-center" style={{ background: "hsl(var(--secondary))" }}>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ready to put this advice into action?
          </h3>
          <p className="text-muted-foreground text-sm mb-4">Book an appointment with one of our expert dentists today.</p>
          <Link to="/book" className="btn-primary">Book Appointment</Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(p => (
                <Link key={p.id} to={`/blog/${p.id}`} className="card-dental block">
                  <span className="text-2xl">{p.image}</span>
                  <h4 className="font-bold mt-2 mb-1 text-sm">{p.title}</h4>
                  <p className="text-xs text-muted-foreground">{p.readTime} · {p.date}</p>
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
