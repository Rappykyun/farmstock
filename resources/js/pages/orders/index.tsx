import { Head } from '@inertiajs/react';

type Props = {
    requests: Array<{
        id: number;
        farmer_name: string | null;
        status: string | null;
        status_color: string | null;
        total_amount: string;
        notes: string | null;
        created_at: string | null;
        items: Array<{
            id: number;
            product_name: string | null;
            quantity: string;
            unit_price: string;
            subtotal: string;
        }>;
    }>;
};

export default function OrdersIndex({ requests }: Props) {
    return (
        <>
            <Head title="My Requests" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">My Order Requests</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder page for the backend order request step.
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">
                        Total requests: {requests.length}
                    </p>
                </div>
            </div>
        </>
    );
}
