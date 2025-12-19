import { apiClient } from "@/api/apiClient";

export async function fetchNotifications() {
  const { data } = await apiClient.get(`/blogpost/blogposts/notifications/`);
  return data;
}

export async function markNotificationRead(id: number) {
  const { data } = await apiClient.patch(`/notifications/${id}/`, { read: true });
  return data;
}
