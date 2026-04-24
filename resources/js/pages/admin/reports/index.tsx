import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
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

const orderVolumeChartConfig = {
    request_count: {
        label: 'Requests',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

const orderValueChartConfig = {
    total_amount: {
        label: 'Order Value',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const userRoleChartConfig = {
    total: {
        label: 'Users',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

const userStatusChartConfig = {
    active: {
        label: 'Active',
        color: 'var(--chart-1)',
    },
    inactive: {
        label: 'Inactive',
        color: 'var(--chart-5)',
    },
} satisfies ChartConfig;

const inventoryValueChartConfig = {
    estimated_stock_value: {
        label: 'Stock Value',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const farmerProductsChartConfig = {
    active_products: {
        label: 'Active Products',
        color: 'var(--chart-1)',
    },
    product_count: {
        label: 'All Products',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

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
    analytics: {
        user_role_breakdown: Array<{
            role: string;
            total: number;
        }>;
        user_status_breakdown: Array<{
            role: string;
            active: number;
            inactive: number;
        }>;
        top_farmers_by_value: Array<{
            farmer_name: string;
            estimated_stock_value: string;
        }>;
        top_farmers_by_products: Array<{
            farmer_name: string;
            product_count: number;
            active_products: number;
        }>;
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

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 2,
    }).format(value);

const formatCompactCurrency = (value: number) =>
    new Intl.NumberFormat('en-PH', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);

const formatChartDate = (value: string) =>
    new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(`${value}T00:00:00`));

const shortenLabel = (value: string, maxLength = 12) =>
    value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;

export default function AdminReportsIndex({
    filters,
    userStats,
    analytics,
    inventorySummary,
    orderVolume,
}: Props) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const totalOrderRequests = orderVolume.reduce(
        (sum, row) => sum + row.request_count,
        0,
    );
    const totalOrderValue = orderVolume.reduce(
        (sum, row) => sum + Number(row.total_amount),
        0,
    );
    const totalInventoryValue = inventorySummary.reduce(
        (sum, row) => sum + Number(row.estimated_stock_value),
        0,
    );
    const totalInventoryUnits = inventorySummary.reduce(
        (sum, row) => sum + Number(row.total_stock_units),
        0,
    );
    const orderVolumeChartData = orderVolume.map((row) => ({
        date: row.date,
        request_count: row.request_count,
        total_amount: Number(row.total_amount),
    }));

    const inventoryValueData = analytics.top_farmers_by_value.map((row) => ({
        farmer_name: row.farmer_name,
        estimated_stock_value: Number(row.estimated_stock_value),
    }));

    const farmerProductsData = analytics.top_farmers_by_products.map((row) => ({
        farmer_name: row.farmer_name,
        product_count: row.product_count,
        active_products: row.active_products,
    }));

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
                        Review user, inventory, and order request data across the platform with a chart-first analytics panel.
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
                            <CardTitle>Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {totalOrderRequests}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Value</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {formatCurrency(totalOrderValue)}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory Value</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {formatCurrency(totalInventoryValue)}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Request Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orderVolume.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No order data for the selected date range.
                                </div>
                            ) : (
                            <ChartContainer
                                    config={orderVolumeChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <LineChart accessibilityLayer data={orderVolumeChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={formatChartDate}
                                        />
                                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    indicator="line"
                                                    labelFormatter={(label) =>
                                                        formatChartDate(String(label))
                                                    }
                                                />
                                            }
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="request_count"
                                            stroke="var(--color-request_count)"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Value Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orderVolume.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No order value data for the selected date range.
                                </div>
                            ) : (
                            <ChartContainer
                                    config={orderValueChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={orderVolumeChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={formatChartDate}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value: number) =>
                                                formatCompactCurrency(Number(value))
                                            }
                                        />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    labelFormatter={(label) =>
                                                        formatChartDate(String(label))
                                                    }
                                                    formatter={(value) =>
                                                        formatCurrency(Number(value))
                                                    }
                                                />
                                            }
                                        />
                                        <Bar
                                            dataKey="total_amount"
                                            fill="var(--color-total_amount)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Role Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={userRoleChartConfig}
                                className="min-h-[260px] w-full"
                            >
                                <BarChart accessibilityLayer data={analytics.user_role_breakdown}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="role"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                    />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar
                                        dataKey="total"
                                        fill="var(--color-total)"
                                        radius={8}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active vs Inactive Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={userStatusChartConfig}
                                className="min-h-[260px] w-full"
                            >
                                <BarChart accessibilityLayer data={analytics.user_status_breakdown}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="role"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                    />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar
                                        dataKey="active"
                                        stackId="users"
                                        fill="var(--color-active)"
                                        radius={[0, 0, 8, 8]}
                                    />
                                    <Bar
                                        dataKey="inactive"
                                        stackId="users"
                                        fill="var(--color-inactive)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Farmers by Inventory Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {inventoryValueData.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No inventory data for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={inventoryValueChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={inventoryValueData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="farmer_name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={(value: string) => shortenLabel(value)}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value: number) =>
                                                formatCompactCurrency(Number(value))
                                            }
                                        />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(value) =>
                                                        formatCurrency(Number(value))
                                                    }
                                                />
                                            }
                                        />
                                        <Bar
                                            dataKey="estimated_stock_value"
                                            fill="var(--color-estimated_stock_value)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Farmer Catalog Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {farmerProductsData.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No catalog data for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={farmerProductsChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={farmerProductsData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="farmer_name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={(value: string) => shortenLabel(value)}
                                        />
                                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar
                                            dataKey="product_count"
                                            fill="var(--color-product_count)"
                                            radius={8}
                                        />
                                        <Bar
                                            dataKey="active_products"
                                            fill="var(--color-active_products)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
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
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
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
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <CardTitle>User Export</CardTitle>
                        <Button type="button" variant="outline" onClick={() => exportCsv('users')}>
                            Export CSV
                        </Button>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground">
                        Download a full user list with role and active status. Current totals: {userStats.admin_users} admins, {userStats.farmer_users} farmers, {userStats.consumer_users} consumers, and {totalInventoryUnits.toFixed(2)} stock units across all farmers.
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
