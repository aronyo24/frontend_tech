import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fetchBlogPosts, moderateBlogPost, BlogPost } from "@/api/blogpost";
import { Loader2, CheckCircle, XCircle, Eye, ShieldAlert } from "lucide-react";

const AdminModeration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    fetchBlogPosts()
      .then((data) => setPosts(data))
      .catch(() => toast({ title: "Failed to load posts", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to publish "${post.title}"?`)) return;
    setActionLoading(true);
    try {
      if (!post.slug) throw new Error("Post slug is missing");
      await moderateBlogPost(post.slug, "published");
      toast({ title: "Post published successfully" });
      loadPosts();
      setSelectedPost(null);
    } catch (error) {
      toast({ title: "Failed to publish post", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPost?.slug) return;
    if (!rejectReason.trim()) {
      toast({ title: "Please provide a reason for rejection", variant: "destructive" });
      return;
    }
    setActionLoading(true);
    try {
      await moderateBlogPost(selectedPost.slug, "rejected", rejectReason);
      toast({ title: "Post rejected" });
      loadPosts();
      setIsRejecting(false);
      setSelectedPost(null);
      setRejectReason("");
    } catch (error) {
      toast({ title: "Failed to reject post", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsRejecting(true);
    setRejectReason("");
  };

  const renderTable = (filteredPosts: BlogPost[]) => (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author_name}</TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === "published"
                        ? "default"
                        : post.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  {post.status !== "published" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => handleApprove(post)}
                      disabled={actionLoading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {post.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => openRejectDialog(post)}
                      disabled={actionLoading}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/dashboard/write/${post.slug}`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-28">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Moderation</h1>
            <p className="text-muted-foreground">
              Manage and moderate blog posts from all users.
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {renderTable(posts.filter((p) => p.status === "pending"))}
          </TabsContent>
          <TabsContent value="published">
            {renderTable(posts.filter((p) => p.status === "published"))}
          </TabsContent>
          <TabsContent value="rejected">
            {renderTable(posts.filter((p) => p.status === "rejected"))}
          </TabsContent>
          <TabsContent value="all">{renderTable(posts.filter((p) => p.status !== "draft"))}</TabsContent>
        </Tabs>

        <Dialog open={isRejecting} onOpenChange={setIsRejecting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Post</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting "{selectedPost?.title}". This will be sent to the author.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejecting(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Reject Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminModeration;
