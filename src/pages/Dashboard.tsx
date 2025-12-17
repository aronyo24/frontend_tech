import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit3,
  Eye,
  FileText,
  Heart,
  Loader2,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  PenSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { fetchBlogPosts, BlogPost, fetchDashboardStats, deleteBlogPost } from "@/api/blogpost";

type PostItem = {
  id: number;
  slug?: string;
  title: string;
  status: "Published" | "Pending Review" | "Rejected";
  lastUpdated: string;
  likes_count?: number | null;
  comments_count?: number | null;
  views?: number | null;
};


const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, loading: authLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total_posts: number; total_likes: number; total_comments: number; total_views: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    setPostsLoading(true);
    fetchBlogPosts()
      .then((data) => {
        setPosts(data);
        setPostsError(null);
      })
      .catch(() => setPostsError("Failed to load blog posts."))
      .finally(() => setPostsLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    setStatsLoading(true);
    fetchDashboardStats()
      .then((data) => {
        setStats(data);
        setStatsError(null);
      })
      .catch(() => setStatsError("Failed to load dashboard stats."))
      .finally(() => setStatsLoading(false));
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) {
      return "";
    }
    const preferred = user.profile?.display_name?.trim();
    if (preferred) {
      return preferred;
    }
    const fullName = `${user.first_name?.trim() ?? ""} ${user.last_name?.trim() ?? ""}`.trim();
    if (fullName) {
      return fullName;
    }
    return user.username || user.email || "";
  }, [user]);

  const greetingName = displayName || "there";

  const primaryRole = useMemo(() => {
    if (!user) {
      return "Update your profile to share your role.";
    }
    const role = user.profile?.profession?.trim();
    if (role) {
      const formatted = role
        .split(/[\s_-]+/)
        .filter((segment) => segment.length > 0)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
      return formatted || role;
    }
    return "Add your profession to complete your profile.";
  }, [user]);

  const avatarInitials = useMemo(() => {
    if (displayName) {
      const parts = displayName.split(" ").filter(Boolean);
      const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
      if (initials) {
        return initials;
      }
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  }, [displayName, user]);

  const avatarImage = user?.profile?.profile_image ?? undefined;

  const filteredPosts = useMemo(() => {
    // Only show posts authored by the current user
    const userPosts = posts.filter((post) => post.author === user?.id);
    const mapStatus = (status: string) => {
      if (status === "published") return "Published";
      if (status === "pending") return "Pending Review";
      if (status === "rejected") return "Rejected";
      return status;
    };
    const toPostItem = (post: BlogPost): PostItem => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      status: mapStatus(post.status) as PostItem["status"],
      lastUpdated: `Updated ${new Date(post.updated_at).toLocaleDateString()}`,
      likes_count: post.likes_count ?? null,
      comments_count: post.comments_count ?? null,
      views: post.views ?? null,
    });
    return {
      all: userPosts.map(toPostItem),
      published: userPosts.filter((p) => p.status === "published").map(toPostItem),
      pending: userPosts.filter((p) => p.status === "pending").map(toPostItem),
      rejected: userPosts.filter((p) => p.status === "rejected").map(toPostItem),
    } as const;
  }, [posts, user]);

  const [actionOpenId, setActionOpenId] = useState<number | null>(null);

  const handleDelete = async (slug?: string, id?: number) => {
    if (!slug) return;
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
    try {
      await deleteBlogPost(slug);
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      toast({ title: "Post deleted." });
    } catch (err) {
      toast({ title: "Unable to delete post." });
    } finally {
      setActionOpenId(null);
    }
  };

  const handleEditProfile = () => {
    navigate("/dashboard/profile");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "Come back soon.",
      });
      navigate("/signin");
    } catch (_error) {
      toast({
        title: "Couldn't sign out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (authLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const renderPostTable = (items: PostItem[]) => {
    if (postsLoading) {
      return (
        <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Loading posts...
        </div>
      );
    }
    if (postsError) {
      return (
        <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center text-sm text-destructive">
          {postsError}
        </div>
      );
    }
    if (!items.length) {
      return (
        <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          No posts to display for this filter yet. Try creating new content or switching filters.
        </div>
      );
    }
    return (
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Post Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="w-14 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((post) => {
              const badgeClass = {
                Published: "border-emerald-200 bg-emerald-500/10 text-emerald-600",
                "Pending Review": "border-amber-200 bg-amber-500/10 text-amber-600",
                Rejected: "border-rose-200 bg-rose-500/10 text-rose-600",
              }[post.status];
              return (
                <TableRow key={post.id} className="group">
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-tight text-foreground">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{post.lastUpdated}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={badgeClass}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-muted-foreground">{
                    (() => {
                      const postData = posts.find((p) => p.id === post.id);
                      return postData?.views ?? "-";
                    })()
                  }</TableCell>
                  <TableCell className="text-right font-semibold text-muted-foreground">{
                    (() => {
                      const postData = posts.find((p) => p.id === post.id);
                      return postData?.likes_count ?? "-";
                    })()
                  }</TableCell>
                  <TableCell className="text-right font-semibold text-muted-foreground">{
                    (() => {
                      const postData = posts.find((p) => p.id === post.id);
                      return postData?.comments_count ?? "-";
                    })()
                  }</TableCell>
                  <TableCell className="text-right relative">
                    <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => setActionOpenId(actionOpenId === post.id ? null : post.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open post actions</span>
                    </Button>
                    {actionOpenId === post.id && (
                      <div className="absolute right-0 top-6 z-50 w-40 rounded-md border bg-background p-2 shadow">
                        <button onClick={() => { setActionOpenId(null); navigate(`/dashboard/write/${post.id}`); }} className="block w-full text-left px-2 py-2 text-sm hover:bg-muted">Edit</button>
                        <button onClick={() => { setActionOpenId(null); const p = posts.find((x) => x.id === post.id); if (p?.slug) window.open(`/blog/${p.slug}`, "_blank"); }} className="block w-full text-left px-2 py-2 text-sm hover:bg-muted">Preview</button>
                        <button onClick={() => { const p = posts.find((x) => x.id === post.id); void handleDelete(p?.slug, post.id); }} className="block w-full text-left px-2 py-2 text-sm text-destructive hover:bg-muted">Delete</button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 pb-16 pt-28">
        <header className="flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              User Account Dashboard
            </p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Welcome back, {greetingName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review your profile insights, track performance, and manage every post from one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {isLoggingOut ? "Signing out..." : "Log out"}
            </Button>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <Card className="border border-primary/10 bg-card/90">
              <CardHeader className="items-center text-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 shadow-md">
                    {avatarImage ? (
                      <AvatarImage src={avatarImage} alt={displayName || "User avatar"} />
                    ) : null}
                    <AvatarFallback>{avatarInitials}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{displayName || "Complete your profile"}</CardTitle>
                <CardDescription className="text-sm font-medium text-muted-foreground">
                  {primaryRole}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleEditProfile}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Key Metrics</CardTitle>
                <CardDescription>Quick snapshot of your audience engagement.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Posts Created</p>
                    <p className="text-2xl font-semibold text-foreground">{stats ? stats.total_posts : "—"}</p>
                  </div>
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Profile Views</p>
                    <p className="text-2xl font-semibold text-foreground">{stats ? stats.total_views : "—"}</p>
                  </div>
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Likes Received</p>
                    <p className="text-2xl font-semibold text-foreground">{stats ? stats.total_likes : "—"}</p>
                  </div>
                  <Heart className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            
          </aside>

          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                  {
                    label: "Total Posts",
                    value: stats ? String(stats.total_posts) : "—",
                    // change: "+12% vs last month",
                    icon: FileText,
                  },
                  {
                    label: "Total Views",
                    value: stats ? String(stats.total_views) : "—",
                    // change: "+8% vs last month",
                    icon: Eye,
                  },
                  {
                    label: "Total Likes",
                    value: stats ? String(stats.total_likes) : "—",
                    // change: "+5% vs last month",
                    icon: Heart,
                  },
                  {
                    label: "Total Comments",
                    value: stats ? String(stats.total_comments) : "—",
                    // change: "+3% vs last month",
                    icon: MessageCircle,
                  },
                ].map((metric) => (
                <Card key={metric.label} className="border border-primary/10">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {metric.label}
                      </span>
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                   
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border border-primary/10">
              <CardHeader className="flex flex-col gap-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">Content Management</CardTitle>
                  <CardDescription>Track every draft, review cycle, and publication in real time.</CardDescription>
                </div>
                <Button asChild className="shadow-sm">
                  <Link to="/dashboard/write">
                    <PenSquare className="h-4 w-4" />
                    Write new post
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="flex w-full justify-start gap-2 overflow-x-auto rounded-xl bg-muted/60 p-1">
                    <TabsTrigger value="all" className="flex items-center gap-2 rounded-lg px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      All posts
                    </TabsTrigger>
                    <TabsTrigger value="published" className="flex items-center gap-2 rounded-lg px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Published
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex items-center gap-2 rounded-lg px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Pending Review
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="flex items-center gap-2 rounded-lg px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Rejected
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">{renderPostTable(filteredPosts.all)}</TabsContent>
                  <TabsContent value="published">{renderPostTable(filteredPosts.published)}</TabsContent>
                  <TabsContent value="pending">{renderPostTable(filteredPosts.pending)}</TabsContent>
                  <TabsContent value="rejected">{renderPostTable(filteredPosts.rejected)}</TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
