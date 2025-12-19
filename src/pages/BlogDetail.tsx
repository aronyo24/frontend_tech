import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, ArrowLeft, Tag, Share2, MessageCircle, Heart, Send, ArrowRight } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchBlogPost,
  fetchBlogPosts,
  BlogPost,
  fetchCommentsBySlug,
  postCommentBySlug,
  fetchLikesBySlug,
  toggleLikeBySlug,
} from "@/api/blogpost";

const ShareMenu = ({ slug }: { slug?: string | null }) => {
  const [open, setOpen] = useState(false);
  const url = typeof window !== "undefined" && slug ? `${window.location.origin}/blog/${slug}` : "";

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard." });
    } catch (_) {
      toast({ title: "Unable to copy link." });
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="gap-2 rounded-full border-primary/40 text-sm font-semibold text-primary hover:bg-transparent"
        onClick={() => setOpen((s) => !s)}
      >
        <Share2 className="h-4 w-4" /> Share
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-background p-3 shadow-lg">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="block px-2 py-2 text-sm hover:bg-muted/20"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="block px-2 py-2 text-sm hover:bg-muted/20"
          >
            Facebook
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="block px-2 py-2 text-sm hover:bg-muted/20"
          >
            LinkedIn
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="block px-2 py-2 text-sm hover:bg-muted/20"
          >
            WhatsApp
          </a>
          <button type="button" onClick={copyUrl} className="mt-2 w-full rounded-md border px-2 py-2 text-sm">
            Copy link
          </button>
        </div>
      )}
    </div>
  );
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<(BlogPost & { readTime: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [likesCount, setLikesCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetchBlogPost(slug)
      .then((data) => setPost(data))
      .catch(() => setError("Blog post not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    // best-effort fetch comments and likes
    void fetchCommentsBySlug(slug)
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));

    void fetchLikesBySlug(slug)
      .then((data) => {
        if (data) {
          setLikesCount(typeof data.likes_count === "number" ? data.likes_count : 0);
          setLiked(Boolean(data.liked));
        }
      })
      .catch(() => {
        setLikesCount(0);
        setLiked(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    fetchBlogPosts()
      .then((allPosts) => {
        const related = allPosts
          .filter((p) => p.category === post.category && p.slug !== post.slug)
          .slice(0, 3)
          .map((p) => ({
            ...p,
            readTime: `${Math.ceil((p.content?.split(/\s+/).length || 0) / 200)} min read`,
          }));
        setRelatedPosts(related);
      })
      .catch((err) => console.error("Failed to fetch related posts", err));
  }, [post]);

  const handleScrollToComments = () => {
    const element = document.getElementById("comments-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }
  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          asChild
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
        >
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </Button>
        <PageHero
          eyebrow={post.category}
          title={post.title}
          description={post.executive_summary}
          topic={post.category}
          className="mb-16"
          media={
            post.banner_image ? (
              <img src={post.banner_image} alt={`${post.title} cover`} className="h-full w-full object-cover" loading="lazy" />
            ) : null
          }
        >
          <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:gap-6">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
            </span>
            <span className="inline-flex items-center gap-2 text-primary font-medium">
              <Tag className="h-4 w-4" />
              {post.category}
            </span>
          </div>
        </PageHero>

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.5fr)_320px]">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-12"
          >
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{post.sub_title}</h2>
              <div className="prose max-w-none text-base leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: post.content }} />
            </section>

            <Card id="comments-section" className="rounded-3xl border border-border/70 bg-background/85 p-8 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Comments ({comments.length})</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">We review every submission to keep the conversation insightful and respectful.</p>

              <div className="mt-6 space-y-6">
                {comments.length === 0 && <div className="text-sm text-muted-foreground italic">No comments yet — be the first to share.</div>}
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {(c.author_name ?? c.author ?? "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{c.author_name ?? c.author}</span>
                        <span className="text-xs text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleString() : ""}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!isAuthenticated) {
                      toast({ title: "Please login first." });
                      return;
                    }
                    if (!commentContent.trim()) {
                      toast({ title: "Please enter a comment." });
                      return;
                    }
                    void postCommentBySlug(String(slug), commentContent.trim())
                      .then((created) => {
                        setComments((prev) => [created, ...prev]);
                        setCommentContent("");
                      })
                      .catch(() => toast({ title: "Unable to post comment." }));
                  }}
                  className="mt-8 space-y-4 rounded-xl bg-muted/30 p-4 border border-border/40"
                >
                  <Textarea rows={4} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Share your perspective or questions..." className="bg-background" />
                  <div className="flex items-center justify-end">
                    <Button type="submit" className="gap-2 rounded-full bg-primary px-6 text-sm font-semibold hover:bg-primary/90">
                      <Send className="h-4 w-4" /> Submit comment
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.article>

          <aside className="space-y-8">
            <Card className="bg-card/60 p-6 backdrop-blur border-primary/10">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">About the author</h4>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-bold">
                  {(post.author_full_name || post.author_name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{post.author_full_name || post.author_name}</p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>
            </Card>
            <Card className="bg-card/60 p-6 backdrop-blur">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Related Articles
              </h4>
              <div className="mt-4 space-y-4">
                {relatedPosts.map((related) => (
                  <div key={related.slug} className="border-b border-border/40 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/70">
                      {related.category}
                    </p>
                    <Link
                      to={`/blog/${related.slug}`}
                      className="mt-2 block text-base font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {related.title}
                    </Link>
                    <p className="mt-2 text-xs text-muted-foreground">{related.readTime}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="mt-6 w-full justify-between" asChild>
                <Link to="/blog">
                  Explore All Articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
            <Card className="bg-card/60 p-6 backdrop-blur border-primary/10 space-y-4 sticky top-24">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">Interactions</h4>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 text-base font-medium"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast({ title: "Please login first." });
                      return;
                    }
                    void toggleLikeBySlug(String(slug))
                      .then((data) => {
                        if (data) {
                          setLiked(Boolean(data.liked));
                          setLikesCount(typeof data.likes_count === "number" ? data.likes_count : likesCount + (data.liked ? 1 : -1));
                        }
                      })
                      .catch(() => toast({ title: "Unable to update like." }));
                  }}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  {liked ? "Liked" : "Like"}
                  <span className="ml-auto text-sm text-muted-foreground">{likesCount}</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 text-base font-medium"
                  onClick={handleScrollToComments}
                >
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  Comment
                  <span className="ml-auto text-sm text-muted-foreground">{comments.length}</span>
                </Button>

                <div className="pt-2">
                  <ShareMenu slug={slug ?? null} />
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
