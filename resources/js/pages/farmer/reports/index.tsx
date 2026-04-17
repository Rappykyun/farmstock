import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import FarmerLayout from '@/layouts/farmer-layout';
import { index } from '@/routes/farmer/reports';
import type { BreadcrumbItem } from '@/types';

type Props = {
    filters: {
        from: string;
        to: string;
        product_id: string;
    };
    products: Array<{
        id: number;
        name: string;
    }>;
    inventorySummary: Array<{
        id: number;
        name: string;
        price: string;
        current_stock: string;
        is_active: boolean;
        estimated_stock_value: string;
    }>;
    orderHistory: Array<{
        id: number;
        consumer_name: string | null;
        status: string | null;
        status_slug: string | null;
        total_amount: string;
        created_at: string | null;
    }>;
    stockMovements: Array<{
        id: number;
        product_name: string | null;
        quantity_change: string;
        quantity_after: string;
        reason: string;
        logged_by: string | null;
        created_at: string | null;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/farmer/reports',
    },
];

export default function FarmerReportsIndex({
    filters,
    products,
    inventorySummary,
    orderHistory,
    stockMovements,
}: Props) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);
    const [productId, setProductId] = useState(filters.product_id || 'all');

    const applyFilters = () => {
        router.get(
            index.url(),
            {
                from,
                to,
                product_id: productId === 'all' ? '' : productId,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const exportCsv = (type: 'inventory' | 'orders' | 'stock-movements') => {
        const query = new URLSearchParams({
            type,
            from,
            to,
            product_id: productId === 'all' ? '' : productId,
        });

        window.location.href = `/farmer/reports/export/csv?${query.toString()}`;
    };

    const exportPdf = () => {
        const query = new URLSearchParams({
            from,
            to,
            product_id: productId === 'all' ? '' : productId,
        });

        window.location.href = `/farmer/reports/export/pdf?${query.toString()}`;
    };

    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Farmer Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        Review your inventory, order history, and stock movement activity.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-4 md:grid-cols-4">
                        <div className="grid gap-2">
                            <Label htmlFor="from">From</Label>
                            <Input
                                id="from"
                                type="date"
                                value={from}
                                onChange={(event) => setFrom(event.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="to">To</Label>
                            <Input
                                id="to"
                                type="date"
                                value={to}
                                onChange={(event) => setTo(event.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="product_id">Product</Label>
                            <Select value={productId} onValueChange={setProductId}>
                                <SelectTrigger id="product_id">
                                    <SelectValue placeholder="All products" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All products</SelectItem>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={String(product.id)}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button type="button" onClick={applyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Inventory Summary</CardTitle>
                        <Button type="button" variant="outline" onClick={() => exportCsv('inventory')}>
                            Export CSV
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Current Stock</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Estimated Value</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {inventorySummary.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>PHP {row.price}</TableCell>
                                        <TableCell>{row.current_stock}</TableCell>
                                        <TableCell>{row.is_active ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>PHP {row.estimated_stock_value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Order History</CardTitle>
                        <Button type="button" variant="outline" onClick={() => exportCsv('orders')}>
                            Export CSV
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Consumer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {orderHistory.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>#{row.id}</TableCell>
                                        <TableCell>{row.consumer_name ?? 'Unknown'}</TableCell>
                                        <TableCell>{row.status ?? 'Unknown'}</TableCell>
                                        <TableCell>PHP {row.total_amount}</TableCell>
                                        <TableCell>{row.created_at ?? 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Stock Movements</CardTitle>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => exportCsv('stock-movements')}
                            >
                                Export CSV
                            </Button>

                            <Button type="button" variant="outline" onClick={exportPdf}>
                                Export PDF
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Change</TableHead>
                                    <TableHead>After</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Logged By</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {stockMovements.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.product_name ?? 'Unknown'}</TableCell>
                                        <TableCell>{row.quantity_change}</TableCell>
                                        <TableCell>{row.quantity_after}</TableCell>
                                        <TableCell>{row.reason}</TableCell>
                                        <TableCell>{row.logged_by ?? 'Unknown'}</TableCell>
                                        <TableCell>{row.created_at ?? 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </FarmerLayout>
    );
}
