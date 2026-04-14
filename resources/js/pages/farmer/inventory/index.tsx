import { Head } from '@inertiajs/react';
import FarmerLayout from '@/layouts/farmer-layout';
import type { BreadcrumbItem } from '@/types';

type InventoryHistory = {
    id: number;
    quantity_change: string;
    quantity_after: string;
    reason: string;
    logged_by: string | null;
    created_at: string | null;
};

type ProductRow = {
    id: number;
    name: string;
    current_stock: string;
    unit: string | null;
    is_active: boolean;
    updated_at: string | null;
    history: InventoryHistory[];
};

type Props = {
    products: ProductRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: '/farmer/inventory',
    },
];

export default function InventoryIndex({ products }: Props) {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Inventory</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder index page for the backend inventory step.
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">
                        Total tracked products: {products.length}
                    </p>
                </div>
            </div>
        </FarmerLayout>
    );
}
