import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import FarmerLayout from '@/layouts/farmer-layout';
import type { BreadcrumbItem, User } from '@/types';

type Props = {
    children: React.ReactNode;
    breadcrumbs: BreadcrumbItem[];
};

export default function SettingsPageLayout({ children, breadcrumbs }: Props) {
    const { auth } = usePage<{ auth: { user?: User | null } }>().props;
    const role = auth.user?.primary_role;

    if (role === 'admin') {
        return <AdminLayout breadcrumbs={breadcrumbs}>{children}</AdminLayout>;
    }

    if (role === 'farmer') {
        return <FarmerLayout breadcrumbs={breadcrumbs}>{children}</FarmerLayout>;
    }

    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}
