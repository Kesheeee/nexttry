'use client';

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer-section";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const featuredPost = {
  title: "How NextTry is redefining mentorship for every stage of life",
  category: "Mentorship",
  description: "Learn how NextTry connects people across generations through guided mentorship, AI tools, and real community — from secondary school to retirement.",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
  date: "Apr 8, 2025",
  readTime: "5 min read",
};

const posts = [
  {
    title: "Finding direction after secondary school — a student's guide",
    category: "Secondary School",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=60",
    date: "Mar 25, 2025",
    readTime: "4 min read",
  },
  {
    title: "Why your university years matter more than your degree",
    category: "University",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60",
    date: "Mar 18, 2025",
    readTime: "6 min read",
  },
  {
    title: "Changing careers at 35 — what nobody tells you",
    category: "Career Change",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60",
    date: "Mar 10, 2025",
    readTime: "7 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Blog</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Our most recent articles
            </h1>
          </motion.div>

          {/* Featured post */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-border overflow-hidden flex flex-col md:flex-row mb-10 group cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{featuredPost.category}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {featuredPost.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{featuredPost.date}</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-200">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
            <div className="md:w-1/2 relative min-h-[260px]">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover" />
            </div>
          </motion.article>

          {/* Post grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="rounded-3xl border border-border overflow-hidden flex flex-col group cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{post.category}</span>
                  <h3 className="text-lg font-bold tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-200">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
