import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { index } from '@/routes/admin/reports';
import type { BreadcrumbItem } from '@/types';

type Props = {
    filters: {
        from: string;
        to: string;
    };
    userStats: {
        total_users: number;
        active_users: number;
        admin_users: number;
        farmer_users: number;
        consumer_users: number;
    };
    inventorySummary: Array<{
        farmer_id: number;
        farmer_name: string;
        product_count: number;
        active_products: number;
        total_stock_units: string;
        estimated_stock_value: string;
    }>;
    orderVolume: Array<{
        date: string;
        request_count: number;
        total_amount: string;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/admin/reports',
    },
];

export default function AdminReportsIndex({
    filters,
    userStats,
    inventorySummary,
    orderVolume,
}: Props) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const applyFilters = () => {
        router.get(
            index.url(),
            { from, to },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const exportCsv = (type: 'users' | 'inventory' | 'orders') => {
        const query = new URLSearchParams({
            type,
            from,
            to,
        });

        window.location.href = `/admin/reports/export?${query.toString()}`;
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Admin Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        Review user, inventory, and order request data across the platform.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4 md:flex-row md:items-end">
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

                        <Button type="button" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Users</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {userStats.total_users}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Users</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {userStats.active_users}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Admins</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {userStats.admin_users}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Farmers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {userStats.farmer_users}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Consumers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {userStats.consumer_users}
                        </CardContent>
                    </Card>
                </div>

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
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Total Stock</TableHead>
                                    <TableHead>Estimated Value</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {inventorySummary.map((row) => (
                                    <TableRow key={row.farmer_id}>
                                        <TableCell>{row.farmer_name}</TableCell>
                                        <TableCell>{row.product_count}</TableCell>
                                        <TableCell>{row.active_products}</TableCell>
                                        <TableCell>{row.total_stock_units}</TableCell>
                                        <TableCell>PHP {row.estimated_stock_value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Order Volume</CardTitle>
                        <Button type="button" variant="outline" onClick={() => exportCsv('orders')}>
                            Export CSV
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Requests</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {orderVolume.map((row) => (
                                    <TableRow key={row.date}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.request_count}</TableCell>
                                        <TableCell>PHP {row.total_amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>User Export</CardTitle>
                        <Button type="button" variant="outline" onClick={() => exportCsv('users')}>
                            Export CSV
                        </Button>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground">
                        Download a full user list with role and active status.
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
