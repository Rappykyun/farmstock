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
import { show } from '@/routes/orders';

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

export default function OrdersIndex({ requests }: Props) {
    return (
        <>
            <Head title="My Requests" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
                <div>
                    <h1 className="text-2xl font-semibold">My Order Requests</h1>
                    <p className="text-sm text-muted-foreground">
                        Review requests you have submitted to farmers.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Requests</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {requests.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No order requests yet.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Farmer</TableHead>
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
                                            <TableCell>{request.farmer_name ?? 'Unknown farmer'}</TableCell>
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
        </>
    );
}
