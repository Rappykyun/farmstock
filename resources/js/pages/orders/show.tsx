import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    FileText,
    Package2,
    Phone,
    Store,
    Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/orders';
import type { BreadcrumbItem } from '@/types';

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
        rejection_reason: string | null;
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Requests',
        href: index.url(),
    },
    {
        title: 'Order Request Details',
        href: index.url(),
    },
];

export default function OrderRequestShow({ request }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Request #${request.id}`} />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
                <Card className="overflow-hidden border-border/70 shadow-sm">
                    <CardContent className="space-y-6 bg-gradient-to-br from-background via-background to-muted/40 p-6 md:p-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                                <Button asChild variant="ghost" className="-ml-3 h-9 px-3 text-muted-foreground">
                                    <Link href={index.url()}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to requests
                                    </Link>
                                </Button>

                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]">
                                            Request
                                        </Badge>
                                        <Badge variant="secondary" className="rounded-full px-3 py-1">
                                            #{request.id}
                                        </Badge>
                                    </div>

                                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                        Order request details
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                        Review the requested items, check the farmer details, and
                                        confirm the current request status in one place.
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
                                        <p className="text-sm text-muted-foreground">Current status</p>
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
                                        <p className="text-sm text-muted-foreground">Total amount</p>
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

                <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle>Requested Items</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 p-5">
                            {request.items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-border/70 bg-gradient-to-br from-background to-muted/25 p-5 shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs">
                                                    Item {index + 1}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-lg font-semibold">
                                                    {item.product_name ?? 'Unknown product'}
                                                </p>
                                                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                                                    {item.product_description || 'No description provided for this item.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid min-w-full gap-2 sm:min-w-[220px]">
                                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                                <div className="rounded-xl bg-muted/70 px-3 py-3">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Qty
                                                    </p>
                                                    <p className="mt-1 font-semibold">{item.quantity}</p>
                                                </div>
                                                <div className="rounded-xl bg-muted/70 px-3 py-3">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Price
                                                    </p>
                                                    <p className="mt-1 font-semibold">PHP {item.unit_price}</p>
                                                </div>
                                                <div className="rounded-xl bg-muted/70 px-3 py-3">
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Subtotal
                                                    </p>
                                                    <p className="mt-1 font-semibold">PHP {item.subtotal}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/70 shadow-sm lg:sticky lg:top-24">
                            <CardHeader className="border-b bg-muted/20">
                                <CardTitle>Request Summary</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6 p-5">
                                <div className="rounded-2xl border bg-muted/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                        Status
                                    </p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <Badge variant="outline" className="rounded-full px-3 py-1">
                                            {request.status ?? 'Unknown'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-foreground">Farmer details</p>
                                    <div className="space-y-3 rounded-2xl border bg-muted/20 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-xl bg-background p-2">
                                                <Store className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold">
                                                    {request.farmer.farm_name || request.farmer.name || 'Unknown farm'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {request.farmer.address || 'No address available'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{request.farmer.contact_number || 'No contact number'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    <div className="rounded-2xl border bg-background p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            Notes
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {request.notes || 'No notes provided for this request.'}
                                        </p>
                                    </div>

                                    {request.rejection_reason && (
                                        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="h-4 w-4 text-destructive" />
                                                Farmer rejection reason
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-foreground">
                                                {request.rejection_reason}
                                            </p>
                                        </div>
                                    )}

                                    <div className="rounded-2xl border bg-background p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            Created at
                                        </div>
                                        <p className="mt-3 text-sm text-foreground">
                                            {request.created_at ?? 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border bg-muted/30 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                        Total amount
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold">
                                        PHP {request.total_amount}
                                    </p>
                                </div>

                                <Button asChild variant="outline" className="h-11 w-full rounded-xl">
                                    <Link href={index.url()}>Back to request list</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
