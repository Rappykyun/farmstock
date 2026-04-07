import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import FarmerLayout from '@/layouts/farmer-layout';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Product',
        href: '/farmer/products',
    },
];

export default function EditProduct() {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <div className="rounded-xl border p-4">
                <h1 className="text-lg font-semibold">Edit Product</h1>
                <p className="text-sm text-muted-foreground">
                    Placeholder edit page for the backend CRUD step.
                </p>
            </div>
        </FarmerLayout>
    );
}
