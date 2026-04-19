import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Mail,
    Package2,
    Phone,
    UserRound,
    Wallet,
} from 'lucide-react';
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

export default function FarmerOrderShow({ request }: Props) {
    const form = useForm<StatusFormData>({
        status: 'accepted',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Orders',
            href: index.url(),
        },
        {
            title: `Order #${request.id}`,
            href: index.url(),
        },
    ];

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
                <Card className="overflow-hidden border-border/70 shadow-sm">
                    <CardContent className="space-y-6 bg-gradient-to-br from-background via-background to-muted/35 p-6 md:p-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                                <Button asChild variant="ghost" className="-ml-3 h-9 px-3 text-muted-foreground">
                                    <Link href={index.url()}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to orders
                                    </Link>
                                </Button>

                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]">
                                            Order
                                        </Badge>
                                        <Badge variant="secondary" className="rounded-full px-3 py-1">
                                            #{request.id}
                                        </Badge>
                                    </div>

                                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                        Order #{request.id}
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                        Review the consumer details, inspect the requested items,
                                        and update the order status when needed.
                                    </p>
                                </div>
                            </div>

                            <div className="grid min-w-full gap-3 sm:grid-cols-2 lg:min-w-[260px] lg:max-w-xs">
                                <div className="rounded-2xl border bg-background/85 p-4 shadow-sm backdrop-blur">
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                        Status
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        {request.status ?? 'Unknown'}
                                    </p>
                                </div>
                                <div className="rounded-2xl border bg-background/85 p-4 shadow-sm backdrop-blur">
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                        Total
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        PHP {request.total_amount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="border-border/70 shadow-none">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Items</p>
                                        <p className="mt-1 text-3xl font-semibold">{request.items.length}</p>
                                    </div>
                                    <div className="rounded-2xl bg-muted p-3">
                                        <Package2 className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 shadow-none">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <p className="mt-1 text-3xl font-semibold">{request.status ?? 'Unknown'}</p>
                                    </div>
                                    <div className="rounded-2xl bg-muted p-3">
                                        <Clock3 className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 shadow-none">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Amount</p>
                                        <p className="mt-1 text-3xl font-semibold">PHP {request.total_amount}</p>
                                    </div>
                                    <div className="rounded-2xl bg-muted p-3">
                                        <Wallet className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle>Requested Items</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 p-5">
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

                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 p-5">
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

                            <div className="rounded-2xl border bg-background p-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    Created At
                                </div>
                                <p className="mt-3 text-sm">{request.created_at ?? 'N/A'}</p>
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
