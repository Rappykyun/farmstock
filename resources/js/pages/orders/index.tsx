import { Head, Link } from '@inertiajs/react';
import { Clock3, Package2, Store, Wallet } from 'lucide-react';
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
    const pendingCount = requests.filter((request) => request.status?.toLowerCase() === 'pending').length;
    const totalAmount = requests.reduce(
        (sum, request) => sum + Number(request.total_amount),
        0,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Requests" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            Consumer Requests
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight">My Requests</h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Review your submitted requests, check their status, and open any request for full details.
                        </p>
                    </div>

                    <Button asChild variant="outline">
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Requests</p>
                                <p className="mt-1 text-3xl font-semibold">{requests.length}</p>
                            </div>
                            <Package2 className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="mt-1 text-3xl font-semibold">{pendingCount}</p>
                            </div>
                            <Clock3 className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Requested Value</p>
                                <p className="mt-1 text-3xl font-semibold">PHP {totalAmount.toFixed(2)}</p>
                            </div>
                            <Wallet className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>Request History</CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {requests.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No order requests yet.
                                </p>
                            </div>
                        ) : (
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
                                        <TableRow key={request.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-medium">Request #{request.id}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {request.notes || 'No notes provided'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Store className="h-4 w-4 text-muted-foreground" />
                                                    <span>{request.farmer_name ?? 'Unknown farmer'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {request.status ?? 'Unknown'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p>{request.items.length} item(s)</p>
                                                    <p className="text-xs text-muted-foreground">
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
                                            <TableCell>{request.created_at ?? 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={show.url(request.id)}>View request</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
