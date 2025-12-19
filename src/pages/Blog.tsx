import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, PenSquare, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchBlogPosts } from "@/api/blogpost";
import { useAuth } from "@/contexts/AuthContext";

const Blog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const predefinedCategories = [
    "Artificial Intelligence",
    "Blockchain",
    "Machine Learning",
    "AI Research",
    "Software Engineering",
  ];

  const categories = ["All", ...predefinedCategories, "Others"];

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (post.status !== "published") return false;

      let matchesCategory = true;
      if (selectedCategory === "All") {
        matchesCategory = true;
      } else if (selectedCategory === "Others") {
        matchesCategory = !predefinedCategories.includes(post.category);
      } else {
        matchesCategory = post.category === selectedCategory;
      }

      const searchSpace = `${post.title} ${post.author_name} ${post.category} ${post.executive_summary}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchSpace.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory, posts]);

  const handleWriteClick = () => {
    if (user) {
      navigate("/dashboard/write");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <PageHero
          className="mb-12"
          eyebrow="Insights"
          title="Tech Blog"
          description="Deep dives on AI, blockchain, and product delivery from the Technoheaven research and engineering teams."
          topic="Insights"
          actions={
            <Button
              size="lg"
              className="rounded-full shadow-md h-12 px-6"
              onClick={handleWriteClick}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Write your own blog
            </Button>
          }
        />


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

        <div className="mx-auto mb-12 max-w-4xl">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
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
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {post.banner_image ? (
                      <img
                        src={post.banner_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/20">
                        <Sparkles className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</span>
                      <span>•</span>
                      <span>By {post.author_name}</span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-foreground leading-tight transition-colors group-hover:text-primary line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="mb-6 flex-grow text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.executive_summary}
                    </p>

                    <Button
                      variant="ghost"
                      className="group/btn w-full justify-between rounded-xl bg-muted/30 hover:bg-primary hover:text-primary-foreground transition-all"
                      onClick={() => window.location.href = `/blog/${post.slug}`}
                    >
                      Read Article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-16 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
          </motion.div>
        )}

        {/* Pagination - Visual only for now as API doesn't support it yet */}
        {filteredPosts.length > 9 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center gap-2 mt-16"
          >
            <Button variant="outline" disabled className="rounded-full">
              Previous
            </Button>
            <Button variant="default" className="bg-primary rounded-full w-10 h-10 p-0">1</Button>
            <Button variant="outline" className="rounded-full w-10 h-10 p-0">2</Button>
            <Button variant="outline" className="rounded-full w-10 h-10 p-0">3</Button>
            <Button variant="outline" className="rounded-full">
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;
