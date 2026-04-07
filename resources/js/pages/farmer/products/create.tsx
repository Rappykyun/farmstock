import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import FarmerLayout from '@/layouts/farmer-layout';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Product',
        href: '/farmer/products/create',
    },
];

export default function CreateProduct() {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <div className="rounded-xl border p-4">
                <h1 className="text-lg font-semibold">Create Product</h1>
                <p className="text-sm text-muted-foreground">
                    Placeholder create page for the backend CRUD step.
                </p>
            </div>
        </FarmerLayout>
    );
}
