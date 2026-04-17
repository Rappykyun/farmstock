import { Head } from '@inertiajs/react';
import FarmerLayout from '@/layouts/farmer-layout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    requests: Array<{
        id: number;
        consumer_name: string | null;
        status: string | null;
        status_slug: string | null;
        total_amount: string;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/farmer/orders',
    },
];

export default function FarmerOrdersIndex({ requests }: Props) {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Incoming Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder page for the backend farmer order handling step.
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">
                        Total incoming requests: {requests.length}
                    </p>
                </div>
            </div>
        </FarmerLayout>
    );
}
