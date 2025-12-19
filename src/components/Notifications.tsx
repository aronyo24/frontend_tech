import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { fetchNotifications, Notification, markNotificationRead } from "@/api/blogpost";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Notifications = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            loadNotifications();
            // Poll for notifications every 60 seconds
            const interval = setInterval(loadNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.read).length);
        } catch (error) {
            console.error("Failed to load notifications", error);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }
        setIsOpen(false);
        if (notification.link) {
            // If link is a slug, navigate to blog detail or edit page depending on context
            // For now, let's assume it's a slug for the blog post
            // If user is admin and notification is about moderation, maybe go to admin panel?
            // But the link stored is just the slug.
            // Let's try to navigate to the blog post preview
            navigate(`/blog/${notification.link}`);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <h4 className="font-semibold leading-none">Notifications</h4>
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <div className="grid gap-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-2 p-4 border-b last:border-0 hover:bg-muted transition-colors ${!notification.read ? "bg-muted/50" : ""}`}
                                >
                                    <button
                                        className="flex-1 text-left"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <p className="text-sm font-medium leading-none mb-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </p>
                                    </button>
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification.id);
                                            }}
                                            title="Mark as read"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="sr-only">Mark as read</span>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default Notifications;
