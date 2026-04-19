import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    Package2,
    Store,
    Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { show } from '@/routes/orders';
import type { BreadcrumbItem } from '@/types';

type RequestRow = {
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
};

type Props = {
    requests: RequestRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Requests',
        href: '/orders',
    },
];

export default function OrdersIndex({ requests }: Props) {
    const pendingCount = requests.filter(
        (request) => request.status?.toLowerCase() === 'pending',
    ).length;
    const totalAmount = requests.reduce(
        (sum, request) => sum + Number(request.total_amount),
        0,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Requests" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
                <Card className="overflow-hidden border-border/70 shadow-sm">
                    <CardContent className="space-y-6 bg-gradient-to-br from-background via-background to-muted/35 p-6 md:p-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                    Consumer Requests
                                </p>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                        My Requests
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                        Review your submitted requests, track their progress, and
                                        open any request when you need the full details.
                                    </p>
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <Button asChild className="h-11 rounded-xl px-5">
                                    <Link href="/products">
                                        Browse Products
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="border-border/70 shadow-none">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Total Requests
                                        </p>
                                        <p className="mt-1 text-3xl font-semibold">{requests.length}</p>
                                    </div>
                                    <div className="rounded-2xl bg-muted p-3">
                                        <Package2 className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 shadow-none">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pending</p>
                                        <p className="mt-1 text-3xl font-semibold">{pendingCount}</p>
                                    </div>
                                    <div className="rounded-2xl bg-muted p-3">
                                        <Clock3 className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 shadow-none">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Requested Value
                                        </p>
                                        <p className="mt-1 text-3xl font-semibold">
                                            PHP {totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-muted p-3">
                                        <Wallet className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/70 shadow-sm">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle>Request History</CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {requests.length === 0 ? (
                            <div className="space-y-3 p-10 text-center">
                                <p className="text-base font-medium">No requests yet</p>
                                <p className="text-sm text-muted-foreground">
                                    Once you send a request to a farmer, it will appear here.
                                </p>
                                <div className="pt-2">
                                    <Button asChild variant="outline">
                                        <Link href="/products">Browse Products</Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="hidden lg:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Request</TableHead>
                                                <TableHead>Farmer</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Items</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {requests.map((request) => (
                                                <TableRow key={request.id} className="align-top">
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">
                                                                Request #{request.id}
                                                            </p>
                                                            <p className="max-w-[200px] text-xs leading-5 text-muted-foreground">
                                                                {request.notes || 'No notes provided'}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-start gap-2">
                                                            <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <span>{request.farmer_name ?? 'Unknown farmer'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="rounded-full px-3 py-1">
                                                            {request.status ?? 'Unknown'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">
                                                                {request.items.length} item(s)
                                                            </p>
                                                            <p className="max-w-[220px] text-xs leading-5 text-muted-foreground">
                                                                {request.items
                                                                    .slice(0, 2)
                                                                    .map((item) => item.product_name)
                                                                    .filter(Boolean)
                                                                    .join(', ') || 'No item names'}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        PHP {request.total_amount}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                            <CalendarDays className="mt-0.5 h-4 w-4" />
                                                            <span>{request.created_at ?? 'N/A'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button asChild size="sm" className="rounded-full px-4">
                                                            <Link href={show.url(request.id)}>View request</Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="grid gap-4 p-4 lg:hidden">
                                    {requests.map((request) => (
                                        <Card key={request.id} className="border-border/70 shadow-none">
                                            <CardContent className="space-y-4 p-5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-semibold">
                                                            Request #{request.id}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {request.farmer_name ?? 'Unknown farmer'}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="rounded-full px-3 py-1">
                                                        {request.status ?? 'Unknown'}
                                                    </Badge>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    <div className="rounded-xl bg-muted/60 p-3">
                                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                            Items
                                                        </p>
                                                        <p className="mt-1 font-semibold">
                                                            {request.items.length} item(s)
                                                        </p>
                                                    </div>
                                                    <div className="rounded-xl bg-muted/60 p-3">
                                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                            Total
                                                        </p>
                                                        <p className="mt-1 font-semibold">
                                                            PHP {request.total_amount}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-xl bg-muted/60 p-3">
                                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                            Date
                                                        </p>
                                                        <p className="mt-1 font-semibold">
                                                            {request.created_at ?? 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Items preview</p>
                                                    <p className="text-sm leading-6 text-muted-foreground">
                                                        {request.items
                                                            .slice(0, 2)
                                                            .map((item) => item.product_name)
                                                            .filter(Boolean)
                                                            .join(', ') || 'No item names'}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Notes</p>
                                                    <p className="text-sm leading-6 text-muted-foreground">
                                                        {request.notes || 'No notes provided'}
                                                    </p>
                                                </div>

                                                <Button asChild className="h-11 w-full rounded-xl">
                                                    <Link href={show.url(request.id)}>View request</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
