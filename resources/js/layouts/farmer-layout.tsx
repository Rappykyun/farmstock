import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FarmerSidebar } from '@/components/farmer-sidebar';
import { NotificationBell } from '@/components/notification-bell';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

type FarmerLayoutProps = {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export default function FarmerLayout({
    children,
    breadcrumbs = [],
}: FarmerLayoutProps) {
    return (
        <AppShell>
            <SidebarProvider>
                <FarmerSidebar />
                <SidebarInset>
                    <div className="flex h-16 items-center gap-2 border-b px-4">
                        <SidebarTrigger />
                        <div className="text-sm font-medium">Farmer Panel</div>
                        <div className="ml-auto">
                            <NotificationBell />
                        </div>
                    </div>

                    {breadcrumbs.length > 0 && (
                        <div className="border-b bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    )}

                    <AppContent>{children}</AppContent>
                </SidebarInset>
            </SidebarProvider>
        </AppShell>
    );
}
