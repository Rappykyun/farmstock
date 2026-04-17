import { Head } from '@inertiajs/react';
import FarmerLayout from '@/layouts/farmer-layout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    request: {
        id: number;
        status: string | null;
        total_amount: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Order Details',
        href: '/farmer/orders',
    },
];

export default function FarmerOrderShow({ request }: Props) {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${request.id}`} />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Order #{request.id}</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder page for the backend farmer order handling step.
                    </p>
                </div>
            </div>
        </FarmerLayout>
    );
}
