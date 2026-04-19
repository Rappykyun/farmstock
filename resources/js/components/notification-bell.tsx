import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NotificationItem = {
    id: string;
    type: string | null;
    title: string;
    message: string;
    url: string | null;
    read_at: string | null;
    created_at: string | null;
};

type SharedProps = {
    notifications: {
        items: NotificationItem[];
        unread_count: number;
    };
};

export function NotificationBell() {
    const { props } = usePage<SharedProps>();
    const notifications = props.notifications?.items ?? [];
    const unreadCount = props.notifications?.unread_count ?? 0;

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            if (document.visibilityState !== 'visible') {
                return;
            }

            router.reload({ only: ['notifications'] });
        }, 10_000);

        return () => window.clearInterval(intervalId);
    }, []);

    const markAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const markAsRead = (id: string) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const openNotification = (notification: NotificationItem) => {
        if (!notification.url) {
            return;
        }

        if (!notification.read_at) {
            router.post(
                `/notifications/${notification.id}/read`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => router.visit(notification.url!),
                },
            );

            return;
        }

        router.visit(notification.url);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white shadow-sm dark:bg-red-500">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-96">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>

                    {notifications.length > 0 && unreadCount > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                <DropdownMenuSeparator />

                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">
                            No notifications yet.
                        </div>
                    ) : (
                        <div className="space-y-2 p-2">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="rounded-lg border p-3"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {notification.message}
                                            </p>
                                        </div>

                                        {!notification.read_at && (
                                            <Badge variant="secondary">New</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {notification.created_at ?? 'N/A'}
                                        </span>

                                        <div className="flex gap-2">
                                            {!notification.read_at && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    Mark read
                                                </Button>
                                            )}

                                            {notification.url && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openNotification(notification)}
                                                >
                                                    Open
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
