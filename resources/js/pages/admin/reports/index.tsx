import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    filters: {
        from: string;
        to: string;
    };
    userStats: {
        total_users: number;
        active_users: number;
        admin_users: number;
        farmer_users: number;
        consumer_users: number;
    };
    inventorySummary: Array<{
        farmer_id: number;
        farmer_name: string;
        product_count: number;
        active_products: number;
        total_stock_units: string;
        estimated_stock_value: string;
    }>;
    orderVolume: Array<{
        date: string;
        request_count: number;
        total_amount: string;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/admin/reports',
    },
];

export default function AdminReportsIndex({ userStats, inventorySummary, orderVolume }: Props) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Admin Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder page for the backend reports step.
                    </p>
                </div>

                <div className="rounded-xl border p-4 text-sm">
                    <p>Total users: {userStats.total_users}</p>
                    <p>Inventory rows: {inventorySummary.length}</p>
                    <p>Order volume rows: {orderVolume.length}</p>
                </div>
            </div>
        </AdminLayout>
    );
}
