import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/orders';

type Props = {
    request: {
        id: number;
        farmer: {
            name: string | null;
            farm_name: string | null;
            address: string | null;
            contact_number: string | null;
        };
        status: string | null;
        status_color: string | null;
        notes: string | null;
        total_amount: string;
        created_at: string | null;
        items: Array<{
            id: number;
            product_name: string | null;
            product_description: string | null;
            quantity: string;
            unit_price: string;
            subtotal: string;
        }>;
    };
};

export default function OrderRequestShow({ request }: Props) {
    return (
        <>
            <Head title={`Request #${request.id}`} />

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
                <div className="space-y-2">
                    <Link href={index.url()} className="text-sm text-muted-foreground underline">
                        Back to requests
                    </Link>
                    <h1 className="text-2xl font-semibold">Request #{request.id}</h1>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Requested Items</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {request.items.map((item) => (
                                <div key={item.id} className="rounded-lg border p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {item.product_name ?? 'Unknown product'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.product_description || 'No description'}
                                            </p>
                                        </div>

                                        <div className="text-right text-sm">
                                            <p>Qty: {item.quantity}</p>
                                            <p>PHP {item.unit_price}</p>
                                            <p className="font-medium">PHP {item.subtotal}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Request Summary</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant="outline">
                                    {request.status ?? 'Unknown'}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Farmer</p>
                                <p className="font-medium">
                                    {request.farmer.farm_name || request.farmer.name || 'Unknown farm'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {request.farmer.address || 'No address'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {request.farmer.contact_number || 'No contact number'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Notes</p>
                                <p>{request.notes || 'No notes provided.'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Created At</p>
                                <p>{request.created_at ?? 'N/A'}</p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="text-2xl font-semibold">
                                    PHP {request.total_amount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
