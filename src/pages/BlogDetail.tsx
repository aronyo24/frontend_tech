import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, ArrowLeft, Tag, Share2, MessageCircle, Heart, Send } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchBlogPost,
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
  const [post, setPost] = useState<any | null>(null);
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
    // init code
  }, []);

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
            <span className="inline-flex items-center gap-2 text-primary">
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

            <Card className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-md md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Share insight</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <ShareMenu slug={slug ?? null} />

                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-primary/30 text-sm font-semibold text-primary/80 hover:bg-transparent"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast({ title: "Please login first." });
                      return;
                    }
                    toast({ title: "Open comment box below." });
                  }}
                >
                  <MessageCircle className="h-4 w-4" /> Discuss
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-primary/20 text-sm font-semibold text-primary/70 hover:bg-transparent"
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
                  <Heart className="h-4 w-4" /> {liked ? "Liked" : "Save"}
                </Button>
              </div>
            </Card>

            <Card className="rounded-3xl border border-border/70 bg-background/85 p-8 shadow-sm backdrop-blur">
              <h3 className="text-lg font-semibold text-foreground">Comments ({comments.length})</h3>
              <p className="mt-2 text-sm text-muted-foreground">We review every submission to keep the conversation insightful and respectful.</p>

              <div className="mt-6 space-y-4">
                {comments.length === 0 && <div className="text-sm text-muted-foreground">No comments yet — be the first to share.</div>}
                {comments.map((c) => (
                  <div key={c.id} className="rounded-md border border-border/40 bg-background/60 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <strong>{c.author_name ?? c.author}</strong>
                      <span className="text-xs text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleString() : ""}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{c.content}</p>
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
                  className="mt-4 space-y-3"
                >
                  <Textarea rows={4} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Share your perspective or questions..." className="rounded-2xl bg-background/70" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Your email stays private. Required fields are marked with *.</span>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">{likesCount} likes</div>
                      <Button type="submit" className="gap-2 rounded-full bg-primary px-6 text-sm font-semibold hover:bg-primary/90">
                        <Send className="h-4 w-4" /> Submit comment
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </Card>
          </motion.article>

          <aside className="space-y-6">
            <Card className="bg-card/60 p-6 backdrop-blur">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">About the author</h4>
              <p className="mt-3 text-lg font-semibold text-foreground">{post.author_name}</p>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
