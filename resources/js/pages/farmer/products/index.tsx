import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import FarmerLayout from '@/layouts/farmer-layout';


type ProductRow = {
    id: number;
    name: string;
    category: string | null;
    unit: string | null;
    status: string | null;
    price: string;
    is_active: boolean;
    created_at: string | null;
};

type Props = {
    products: ProductRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/farmer/products',
    },
];

export default function ProductsIndex({ products }: Props) {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder index page for the backend CRUD step.
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">Total products: {products.length}</p>
                </div>
            </div>
        </FarmerLayout>
    );
}
