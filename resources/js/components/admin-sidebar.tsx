import { Link } from '@inertiajs/react';
import { BarChart3, CircleDot, LayoutGrid, Ruler, Tags, User } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        href: '/admin/product-categories',
        icon: Tags,
    },
    {
        title: 'Units',
        href: '/admin/units',
        icon: Ruler,
    },
    {
        title: 'Statuses',
        href: '/admin/statuses',
        icon: CircleDot,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: User,
    },
    {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
},

];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
