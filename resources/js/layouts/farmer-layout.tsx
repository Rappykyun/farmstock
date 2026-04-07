import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { FarmerSidebar } from '@/components/farmer-sidebar';
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
                    </div>

                    {breadcrumbs.length > 0 && (
                        <div className="border-b px-4 py-3 text-sm text-muted-foreground">
                            {breadcrumbs[breadcrumbs.length - 1]?.title}
                        </div>
                    )}

                    <AppContent>{children}</AppContent>
                </SidebarInset>
            </SidebarProvider>
        </AppShell>
    );
}
