import { apiClient } from "@/api/apiClient";

export interface BlogPost {
  id: number;
  title: string;
  sub_title?: string;
  executive_summary?: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: number;
  author_name: string;
  status: "draft" | "pending" | "published" | "rejected";
  status_display?: string;
  admin_comment?: string | null;
  likes_count?: number;
  comments_count?: number;
  slug?: string;
  views?: number;
  category?: string;
  tags?: string[];
  banner_image?: string | null;
  allow_comments?: boolean;
}
export interface CreateBlogPostPayload {
  title: string;
  sub_title?: string;
  executive_summary?: string;
  content: string;
  banner_image?: File | null;
  category?: string;
  tags?: string[];
  allow_comments?: boolean;
  status?: string;
  schedule_date?: string;
  schedule_time?: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data } = await apiClient.get<BlogPost[]>("/blogpost/blogposts/");
  return data;
}

export async function fetchBlogPost(idOrSlug: number | string): Promise<BlogPost> {
  let url: string;
  if (typeof idOrSlug === 'number' || /^[0-9]+$/.test(idOrSlug)) {
    url = `/blogpost/blogposts/${idOrSlug}/`;
  } else {
    url = `/blogpost/blogposts/slug/${idOrSlug}/`;
  }
  const { data } = await apiClient.get<BlogPost>(url);
  return data;
}

export async function createBlogPost(payload: CreateBlogPostPayload): Promise<BlogPost> {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.sub_title) formData.append("sub_title", payload.sub_title);
  if (payload.executive_summary) formData.append("executive_summary", payload.executive_summary);
  formData.append("content", payload.content);
  if (payload.banner_image) formData.append("banner_image", payload.banner_image);
  if (payload.category) formData.append("category", payload.category);
  if (payload.tags) formData.append("tags", JSON.stringify(payload.tags));
  if (typeof payload.allow_comments === "boolean") formData.append("allow_comments", String(payload.allow_comments));
  if (payload.schedule_date) formData.append("schedule_date", payload.schedule_date);
  if (payload.schedule_time) formData.append("schedule_time", payload.schedule_time);
  if ((payload as any).status) formData.append("status", (payload as any).status);

  const { data } = await apiClient.post<BlogPost>("/blogpost/blogposts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateBlogPost(id: number | string, payload: Partial<CreateBlogPostPayload> & { status?: string }): Promise<BlogPost> {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.sub_title) formData.append("sub_title", payload.sub_title);
  if (payload.executive_summary) formData.append("executive_summary", payload.executive_summary);
  if (payload.content) formData.append("content", payload.content);
  if ((payload as any).banner_image) formData.append("banner_image", (payload as any).banner_image);
  if (payload.category) formData.append("category", payload.category);
  if (payload.tags) formData.append("tags", JSON.stringify(payload.tags));
  if (typeof payload.allow_comments === "boolean") formData.append("allow_comments", String(payload.allow_comments));
  if (payload.schedule_date) formData.append("schedule_date", payload.schedule_date);
  if (payload.schedule_time) formData.append("schedule_time", payload.schedule_time);
  if (payload.status) formData.append("status", payload.status);

  const { data } = await apiClient.patch<BlogPost>(`/blogpost/blogposts/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}


// Admin moderation
export async function moderateBlogPost(id: number, status: "published" | "rejected", admin_comment?: string): Promise<BlogPost> {
  const { data } = await apiClient.patch<BlogPost>(`/blogpost/blogposts/${id}/moderate/`, { status, admin_comment });
  return data;
}

// Comments
export async function fetchCommentsBySlug(slug: string) {
  const { data } = await apiClient.get(`/blogpost/blogposts/slug/${slug}/comments/`);
  return data;
}

export async function postCommentBySlug(slug: string, content: string) {
  const { data } = await apiClient.post(`/blogpost/blogposts/slug/${slug}/comments/`, { content });
  return data;
}

// Likes
export async function fetchLikesBySlug(slug: string) {
  const { data } = await apiClient.get(`/blogpost/blogposts/slug/${slug}/likes/`);
  return data; // expected { liked: boolean, likes_count: number }
}

export async function toggleLikeBySlug(slug: string) {
  const { data } = await apiClient.post(`/blogpost/blogposts/slug/${slug}/like/`);
  return data; // expected { liked: boolean, likes_count: number }
}

// Dashboard stats for current user (requires auth)
export async function fetchDashboardStats() {
  const { data } = await apiClient.get(`/blogpost/blogposts/stats/`);
  return data as { total_posts: number; total_likes: number; total_comments: number; total_views: number };
}

export async function deleteBlogPost(slug: string) {
  const { data } = await apiClient.delete(`/blogpost/blogposts/${slug}/`);
  return data;
}
