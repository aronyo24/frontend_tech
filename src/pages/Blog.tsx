import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchBlogPosts } from "@/api/blogpost";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchBlogPosts()
      .then((data) => {
        setPosts(data);
        setError(null);
      })
      .catch(() => setError("Failed to load blog posts."))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = posts.reduce<string[]>((acc, post) => {
      if (post.status === "published" && post.category && !acc.includes(post.category)) {
        acc.push(post.category);
      }
      return acc;
    }, []);
    return ["All", ...unique];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (post.status !== "published") return false;
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const searchSpace = `${post.title} ${post.author_name} ${post.category} ${post.executive_summary}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchSpace.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory, posts]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <PageHero
          className="mb-12"
          eyebrow="Insights"
          title="Tech Blog"
          description="Deep dives on AI, blockchain, and product delivery from the Technoheaven research and engineering teams."
          topic="Insights"
        />

        <div className="mx-auto mb-12 max-w-3xl">
          <label htmlFor="blog-search" className="mb-3 block text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Search Articles
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="blog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, author, topic, or tag"
              className="h-12 w-full rounded-2xl border border-border/60 bg-background/80 pl-11 pr-4 text-base shadow-sm focus-visible:border-primary/60 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-primary/30 text-muted-foreground hover:bg-primary/10"
              }
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="group flex h-full flex-col bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                  <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    <span className="text-primary/70">{post.category}</span>
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>

                  <p className="mt-3 flex-grow text-sm leading-relaxed text-muted-foreground">
                    {post.executive_summary}
                  </p>

                  <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>By {post.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="mt-6 w-full justify-between rounded-xl text-foreground transition-colors hover:bg-transparent group-hover:text-primary"
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                  >
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-12 text-center text-muted-foreground"
          >
            No articles match your search yet. Try a different keyword or reset the filters.
          </motion.div>
        )}

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mt-12"
        >
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="default" className="bg-primary">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">
            Next
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
