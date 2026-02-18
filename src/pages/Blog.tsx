import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Maintaining a Healthy Smile at Home",
    excerpt: "Discover the daily habits that top dentists recommend for keeping your teeth and gums in perfect health between visits.",
    category: "Oral Health",
    readTime: "5 min read",
    date: "Dec 18, 2024",
    author: "Dr. Aisha Patel",
    image: "🦷",
    content: `Good oral hygiene starts at home. Brushing twice daily with fluoride toothpaste, flossing regularly, and rinsing with an antibacterial mouthwash are the foundation of a healthy smile. Diet plays a huge role too — limit sugary snacks and acidic beverages like soda and citrus juices. Drink plenty of water, especially fluoridated tap water. Replace your toothbrush every 3-4 months or after an illness. Don't forget to clean your tongue, which harbors bacteria. Regular dental checkups every 6 months allow us to catch issues early. Consider using an electric toothbrush for superior plaque removal. Protect your teeth during sports with a custom mouthguard. And finally, avoid using your teeth as tools to open packages — this can cause chips and cracks.`,
  },
  {
    id: 2,
    title: "What to Expect During Your First Dental Visit",
    excerpt: "Nervous about visiting the dentist for the first time? Here's a complete walkthrough of what happens during a routine appointment.",
    category: "Patient Guide",
    readTime: "4 min read",
    date: "Dec 12, 2024",
    author: "Dr. James Morrison",
    image: "🏥",
    content: `Your first dental visit is nothing to fear! It typically starts with a comprehensive health history review, where we'll ask about medications, allergies, and any dental concerns. Next comes a full mouth X-ray examination to see what's happening below the surface. Our hygienist will then perform a professional cleaning, removing tartar buildup that home brushing can't reach. The dentist will conduct a thorough examination of your teeth, gums, and jaw. We check for cavities, gum disease, bite issues, and even screen for oral cancer. After the exam, we'll discuss our findings and create a personalized treatment plan. Questions are always welcome — we want you to be fully informed about your oral health.`,
  },
  {
    id: 3,
    title: "Teeth Whitening: Professional vs At-Home Treatments",
    excerpt: "A comprehensive comparison of professional in-office whitening versus popular at-home kits — find out which is right for you.",
    category: "Cosmetic Dentistry",
    readTime: "6 min read",
    date: "Dec 5, 2024",
    author: "Dr. Aisha Patel",
    image: "✨",
    content: `Teeth whitening is one of the most popular cosmetic dental treatments, but the options can be overwhelming. Professional in-office whitening uses prescription-strength hydrogen peroxide (up to 40%) activated by a special light, delivering results in just one hour. You can expect teeth to lighten 6-8 shades. At-home kits from pharmacies use 3-10% peroxide and require daily use for 2-4 weeks. While cheaper, results are less dramatic. Custom take-home trays from your dentist offer a middle ground — professional-grade gel (10-20%) in trays made to fit your teeth perfectly. Whitening strips are convenient but may cause temporary sensitivity. Whitening toothpastes only remove surface stains. We recommend professional whitening for special occasions or when you want maximum results quickly, and custom trays for ongoing maintenance.`,
  },
  {
    id: 4,
    title: "Understanding Gum Disease: Prevention and Treatment",
    excerpt: "Gum disease affects nearly half of American adults. Learn how to prevent it and what treatment options are available.",
    category: "Oral Health",
    readTime: "7 min read",
    date: "Nov 28, 2024",
    author: "Dr. Lisa Chen",
    image: "🔬",
    content: `Periodontal (gum) disease is one of the most common dental conditions, ranging from simple gum inflammation (gingivitis) to serious disease that results in major damage to the soft tissue and bone supporting teeth. Warning signs include red, swollen, or tender gums; bleeding when brushing; persistent bad breath; and gums pulling away from teeth. Risk factors include smoking, diabetes, certain medications, and genetic susceptibility. Prevention is straightforward: brush twice daily, floss daily, quit smoking, and schedule regular dental cleanings. Treatment depends on severity — mild gingivitis can often be reversed with professional cleaning and improved home care. Advanced periodontitis may require scaling and root planing (deep cleaning), medications, or surgery. The good news is that with proper care, gum disease is very manageable.`,
  },
  {
    id: 5,
    title: "Is It Time for Dental Implants? Everything You Need to Know",
    excerpt: "Missing teeth? Dental implants are the gold standard replacement. Here's a complete guide to the implant process and what to expect.",
    category: "Dental Implants",
    readTime: "8 min read",
    date: "Nov 20, 2024",
    author: "Dr. James Morrison",
    image: "🏆",
    content: `Dental implants are titanium posts surgically placed in the jawbone to act as tooth roots. They support crowns, bridges, or dentures and are considered the gold standard for tooth replacement. The process begins with a consultation and 3D imaging to assess bone density and plan placement. Surgery involves inserting the implant under local anesthesia. Over 3-6 months, osseointegration occurs — the implant fuses with your jawbone. Once healed, an abutment and custom crown are attached. The result looks, feels, and functions exactly like a natural tooth. Implants preserve jawbone, preventing the facial sagging that occurs with missing teeth. They require the same care as natural teeth. While the initial cost is higher than bridges or dentures, implants are more cost-effective long-term as they can last a lifetime with proper care.`,
  },
  {
    id: 6,
    title: "Kids and Dental Health: Building Good Habits Early",
    excerpt: "Setting children up for a lifetime of healthy smiles starts young. Expert tips from our pediatric dentistry team.",
    category: "Pediatric",
    readTime: "5 min read",
    date: "Nov 14, 2024",
    author: "Dr. Lisa Chen",
    image: "👶",
    content: `Children's dental health is foundational for their overall wellbeing. The first dental visit should happen around age 1, or when the first tooth appears. Start brushing as soon as that first tooth erupts, using a tiny smear of fluoride toothpaste. At age 3, a pea-sized amount is appropriate. Introduce flossing when teeth touch each other. Make brushing fun with timers, songs, or apps designed for children. Limit sugary snacks and juice — water is always the best between-meal drink. Dental sealants on back teeth can dramatically reduce cavity risk. Consider fluoride varnish treatments for added protection. Thumb-sucking and pacifier use are fine for infants but should be discouraged after age 3 to prevent bite problems. Most importantly, create a positive attitude toward dental visits so children don't develop dental anxiety.`,
  },
];

const categories = ["All", "Oral Health", "Patient Guide", "Cosmetic Dentistry", "Dental Implants", "Pediatric"];

export default function Blog() {
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
          {/* Featured post */}
          <div className="card-dental mb-10 md:flex gap-8 items-center">
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-5xl mb-4 md:mb-0"
              style={{ background: "hsl(var(--secondary))" }}>
              {blogPosts[0].image}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="section-tag text-xs">{blogPosts[0].category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {blogPosts[0].readTime}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {blogPosts[0].title}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">{blogPosts[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">By {blogPosts[0].author} · {blogPosts[0].date}</span>
                <Link to={`/blog/${blogPosts[0].id}`} className="btn-primary text-xs px-4 py-2">
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post, i) => (
              <div key={post.id} className={`card-dental flex flex-col animate-fade-up animate-delay-${(i % 3) * 100}`}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ background: "hsl(var(--secondary))" }}>
                  {post.image}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="section-tag text-xs">{post.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2 leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: "hsl(var(--primary))" }}>
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
