import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

type ProductCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
};

type Props = {
    categories: ProductCategory[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Categories',
        href: '/admin/product-categories',
    },
];

export default function ProductCategoriesIndex({ categories }: Props) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Categories" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Product Categories</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder index page for the backend CRUD step.
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">
                        Total categories: {categories.length}
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
