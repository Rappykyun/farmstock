import { Head, Link } from '@inertiajs/react';
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
import FarmerLayout from '@/layouts/farmer-layout';
import { show } from '@/routes/farmer/orders';
import type { BreadcrumbItem } from '@/types';

type RequestRow = {
    id: number;
    consumer_name: string | null;
    consumer_email: string | null;
    consumer_contact: string | null;
    status: string | null;
    status_slug: string | null;
    status_color: string | null;
    notes: string | null;
    total_amount: string;
    created_at: string | null;
    items: Array<{
        id: number;
        product_name: string | null;
        unit: string | null;
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
        title: 'Orders',
        href: '/farmer/orders',
    },
];

export default function FarmerOrdersIndex({ requests }: Props) {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Incoming Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        Review and manage requests sent by consumers.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Requests</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {requests.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No incoming order requests yet.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Consumer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>#{request.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {request.consumer_name ?? 'Unknown consumer'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {request.consumer_email ?? 'No email'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {request.status ?? 'Unknown'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>PHP {request.total_amount}</TableCell>
                                            <TableCell>{request.created_at ?? 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={show.url(request.id)}
                                                    className="text-sm underline"
                                                >
                                                    View
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </FarmerLayout>
    );
}
