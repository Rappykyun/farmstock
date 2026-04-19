import { Head, Link, useForm } from '@inertiajs/react';
import { Clock3, Mail, Package2, Phone, UserRound, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FarmerLayout from '@/layouts/farmer-layout';
import { index, update } from '@/routes/farmer/orders';
import type { BreadcrumbItem } from '@/types';

type FarmerOrderItem = {
    id: number;
    product_id: number;
    product_name: string | null;
    product_description: string | null;
    current_stock: string | null;
    unit: string | null;
    quantity: string;
    unit_price: string;
    subtotal: string;
};

type Props = {
    request: {
        id: number;
        consumer: {
            name: string | null;
            email: string | null;
            contact_number: string | null;
            address: string | null;
        };
        status: string | null;
        status_slug: string | null;
        status_color: string | null;
        notes: string | null;
        total_amount: string;
        created_at: string | null;
        items: FarmerOrderItem[];
    };
};

type StatusFormData = {
    status: 'accepted' | 'rejected' | 'completed';
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Order Details',
        href: '/farmer/orders',
    },
];

export default function FarmerOrderShow({ request }: Props) {
    const form = useForm<StatusFormData>({
        status: 'accepted',
    });

const submitStatus = (status: 'accepted' | 'rejected' | 'completed') => {
    form.transform((data) => ({
        ...data,
        status,
    }));

    form.patch(update.url(request.id));
};


    const canAcceptOrReject = request.status_slug === 'pending';
    const canComplete = request.status_slug === 'accepted';

    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${request.id}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                        <Link
                            href={index.url()}
                            className="text-sm text-muted-foreground underline"
                        >
                            Back to orders
                        </Link>
                        <h1 className="text-3xl font-semibold tracking-tight">Order #{request.id}</h1>
                        <p className="text-sm text-muted-foreground">
                            Review the consumer details, requested items, and update the order status when needed.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="px-3 py-1">
                            {request.status ?? 'Unknown'}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            PHP {request.total_amount}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Items</p>
                                <p className="mt-1 text-3xl font-semibold">{request.items.length}</p>
                            </div>
                            <Package2 className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="mt-1 text-3xl font-semibold">{request.status ?? 'Unknown'}</p>
                            </div>
                            <Clock3 className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="mt-1 text-3xl font-semibold">PHP {request.total_amount}</p>
                            </div>
                            <Wallet className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Requested Items</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {request.items.map((item) => (
                                <div key={item.id} className="rounded-xl border bg-card p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {item.product_name ?? 'Unknown product'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.product_description || 'No description'}
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Current stock: {item.current_stock ?? '0'}{' '}
                                                {item.unit ?? ''}
                                            </p>
                                        </div>

                                        <div className="min-w-32 rounded-lg bg-muted/60 p-3 text-right text-sm">
                                            <p>
                                                Qty: {item.quantity} {item.unit ?? ''}
                                            </p>
                                            <p>PHP {item.unit_price}</p>
                                            <p className="font-medium">
                                                PHP {item.subtotal}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b">
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant="outline">
                                    {request.status ?? 'Unknown'}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Consumer</p>
                                <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                                    <p className="flex items-center gap-2 font-medium">
                                        <UserRound className="h-4 w-4 text-muted-foreground" />
                                        {request.consumer.name || 'Unknown consumer'}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        {request.consumer.email || 'No email'}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        {request.consumer.contact_number || 'No contact number'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {request.consumer.address || 'No address'}
                                    </p>
                                </div>
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

                            <div className="flex flex-col gap-2 border-t pt-4">
                                {canAcceptOrReject && (
                                    <>
                                        <Button
                                            type="button"
                                            onClick={() => submitStatus('accepted')}
                                            disabled={form.processing}
                                        >
                                            Accept Order
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => submitStatus('rejected')}
                                            disabled={form.processing}
                                        >
                                            Reject Order
                                        </Button>
                                    </>
                                )}

                                {canComplete && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => submitStatus('completed')}
                                        disabled={form.processing}
                                    >
                                        Mark as Completed
                                    </Button>
                                )}

                                {!canAcceptOrReject && !canComplete && (
                                    <p className="text-sm text-muted-foreground">
                                        No further status actions available.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FarmerLayout>
    );
}
