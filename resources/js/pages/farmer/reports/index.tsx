import { Head } from '@inertiajs/react';
import FarmerLayout from '@/layouts/farmer-layout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    filters: {
        from: string;
        to: string;
        product_id: string;
    };
    products: Array<{
        id: number;
        name: string;
    }>;
    inventorySummary: Array<{
        id: number;
        name: string;
        price: string;
        current_stock: string;
        is_active: boolean;
        estimated_stock_value: string;
    }>;
    orderHistory: Array<{
        id: number;
        consumer_name: string | null;
        status: string | null;
        status_slug: string | null;
        total_amount: string;
        created_at: string | null;
    }>;
    stockMovements: Array<{
        id: number;
        product_name: string | null;
        quantity_change: string;
        quantity_after: string;
        reason: string;
        logged_by: string | null;
        created_at: string | null;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/farmer/reports',
    },
];

export default function FarmerReportsIndex({
    inventorySummary,
    orderHistory,
    stockMovements,
}: Props) {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Farmer Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder page for the backend farmer reports step.
                    </p>
                </div>

                <div className="rounded-xl border p-4 text-sm">
                    <p>Inventory rows: {inventorySummary.length}</p>
                    <p>Order history rows: {orderHistory.length}</p>
                    <p>Stock movement rows: {stockMovements.length}</p>
                </div>
            </div>
        </FarmerLayout>
    );
}
