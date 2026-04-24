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

const orderStatusChartConfig = {
    total: {
        label: 'Orders',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

const inventoryValueChartConfig = {
    stock_value: {
        label: 'Stock Value',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const requestTrendChartConfig = {
    amount: {
        label: 'Requested Value',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

const topProductsChartConfig = {
    quantity: {
        label: 'Requested Quantity',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

const consumerActivityChartConfig = {
    orders: {
        label: 'Orders',
        color: 'var(--chart-5)',
    },
} satisfies ChartConfig;

const stockMovementTrendChartConfig = {
    stock_in: {
        label: 'Stock In',
        color: 'var(--chart-1)',
    },
    stock_out: {
        label: 'Stock Out',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

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
    analytics: {
        top_products: Array<{
            product_name: string;
            total_quantity: string;
            total_amount: string;
        }>;
    };
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

const formatPercent = (value: number) => `${value.toFixed(0)}%`;

const shortenLabel = (value: string, maxLength = 10) =>
    value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;

const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const buildDateRange = (from: string, to: string) => {
    const dates: string[] = [];
    const current = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);

    while (current <= end) {
        dates.push(toDateKey(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

const formatChartDate = (value: string) =>
    new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(`${value}T00:00:00`));

export default function FarmerReportsIndex({
    filters,
    products,
    analytics,
    inventorySummary,
    orderHistory,
    stockMovements,
}: Props) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);
    const [productId, setProductId] = useState(filters.product_id || 'all');
    const selectedProductLabel =
        products.find((product) => String(product.id) === filters.product_id)?.name ??
        'All products';

    const inventoryTotalValue = inventorySummary.reduce(
        (sum, row) => sum + Number(row.estimated_stock_value),
        0,
    );
    const requestedValue = orderHistory.reduce(
        (sum, row) => sum + Number(row.total_amount),
        0,
    );
    const completedValue = orderHistory
        .filter((row) => row.status_slug === 'completed')
        .reduce((sum, row) => sum + Number(row.total_amount), 0);
    const totalOrders = orderHistory.length;
    const uniqueConsumers = new Set(
        orderHistory
            .map((row) => row.consumer_name)
            .filter((value): value is string => Boolean(value)),
    ).size;
    const acceptedOrCompletedCount = orderHistory.filter(
        (row) => row.status_slug === 'accepted' || row.status_slug === 'completed',
    ).length;
    const acceptanceRate =
        totalOrders === 0 ? 0 : (acceptedOrCompletedCount / totalOrders) * 100;

    const orderStatusData = ['pending', 'accepted', 'completed', 'rejected']
        .map((statusSlug) => {
            const rows = orderHistory.filter((row) => row.status_slug === statusSlug);

            return {
                status: statusSlug.replace(/^\w/, (letter) => letter.toUpperCase()),
                total: rows.length,
            };
        })
        .filter((row) => row.total > 0);

    const inventoryValueData = [...inventorySummary]
        .sort(
            (left, right) =>
                Number(right.estimated_stock_value) - Number(left.estimated_stock_value),
        )
        .slice(0, 6)
        .map((row) => ({
            name: row.name,
            stock_value: Number(row.estimated_stock_value),
        }));

    const requestTrendMap = orderHistory.reduce<
        Map<string, { date: string; amount: number }>
    >((map, row) => {
        if (!row.created_at) {
            return map;
        }

        const date = row.created_at.slice(0, 10);
        const current = map.get(date) ?? { date, amount: 0 };
        current.amount += Number(row.total_amount);
        map.set(date, current);

        return map;
    }, new Map());

    const requestTrendData = buildDateRange(filters.from, filters.to).map((date) => ({
        date,
        amount: requestTrendMap.get(date)?.amount ?? 0,
    }));

    const consumerActivityData = Array.from(
        orderHistory.reduce<
            Map<string, { consumer: string; orders: number; amount: number }>
        >((map, row) => {
            const consumer = row.consumer_name ?? 'Unknown';
            const current = map.get(consumer) ?? { consumer, orders: 0, amount: 0 };

            current.orders += 1;
            current.amount += Number(row.total_amount);
            map.set(consumer, current);

            return map;
        }, new Map()).values(),
    )
        .sort((left, right) => right.orders - left.orders || right.amount - left.amount)
        .slice(0, 6);

    const topProductsData = analytics.top_products.map((row) => ({
        product_name: row.product_name,
        quantity: Number(row.total_quantity),
        amount: Number(row.total_amount),
    }));

    const stockMovementTrendMap = stockMovements.reduce<
        Map<string, { date: string; stock_in: number; stock_out: number }>
    >((map, row) => {
        if (!row.created_at) {
            return map;
        }

        const date = row.created_at.slice(0, 10);
        const current = map.get(date) ?? { date, stock_in: 0, stock_out: 0 };
        const change = Number(row.quantity_change);

        if (change > 0) {
            current.stock_in += change;
        } else if (change < 0) {
            current.stock_out += Math.abs(change);
        }

        map.set(date, current);

        return map;
    }, new Map());

    const stockMovementTrendData = buildDateRange(filters.from, filters.to).map((date) => ({
        date,
        stock_in: stockMovementTrendMap.get(date)?.stock_in ?? 0,
        stock_out: stockMovementTrendMap.get(date)?.stock_out ?? 0,
    }));

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

    const printReport = () => {
        window.print();
    };

    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="report-print-page space-y-6 p-4 print:space-y-4 print:p-0">
                <section className="report-print-header hidden print:block">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Farmer Analytics Report
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Date range: {filters.from} to {filters.to}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Product filter: {selectedProductLabel}
                        </p>
                    </div>
                </section>

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Farmer Reports</h1>
                        <p className="text-sm text-muted-foreground">
                            Review your inventory, order history, and stock movement activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 print:hidden">
                        <Button type="button" variant="outline" onClick={printReport}>
                            Print Report
                        </Button>
                        <Button type="button" variant="outline" onClick={exportPdf}>
                            Export PDF
                        </Button>
                    </div>
                </div>

                <div className="report-print-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Inventory Value</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {formatCurrency(inventoryTotalValue)}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Requested Value</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {formatCurrency(requestedValue)}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Completed Value</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {formatCurrency(completedValue)}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Orders in Range</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {totalOrders}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Unique Consumers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {uniqueConsumers}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Acceptance Rate</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">
                            {formatPercent(acceptanceRate)}
                        </CardContent>
                    </Card>
                </div>

                <Card className="report-print-card print:hidden">
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

                <div className="report-print-grid grid gap-6 xl:grid-cols-2">
                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Order Status Breakdown</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {orderStatusData.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No order history is available for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={orderStatusChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={orderStatusData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="status"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                        />
                                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar
                                            dataKey="total"
                                            fill="var(--color-total)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Highest Value Inventory</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {inventoryValueData.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No inventory data is available for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={inventoryValueChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={inventoryValueData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={(value: string) =>
                                                value.length > 10 ? `${value.slice(0, 10)}…` : value
                                            }
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
                                            dataKey="stock_value"
                                            fill="var(--color-stock_value)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="report-print-grid grid gap-6 xl:grid-cols-2">
                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Request Value Trend</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {totalOrders === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No requests are available for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={requestTrendChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <LineChart accessibilityLayer data={requestTrendData}>
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
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="var(--color-amount)"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Top Requested Products</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {topProductsData.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No product demand data is available for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={topProductsChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={topProductsData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="product_name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={(value: string) => shortenLabel(value, 12)}
                                        />
                                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(value, name, item) =>
                                                        name === 'quantity'
                                                            ? `${Number(value).toFixed(2)} units`
                                                            : formatCurrency(
                                                                  Number(item.payload.amount),
                                                              )
                                                    }
                                                />
                                            }
                                        />
                                        <Bar
                                            dataKey="quantity"
                                            fill="var(--color-quantity)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="report-print-grid grid gap-6 xl:grid-cols-2">
                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Most Active Consumers</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {consumerActivityData.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No consumer activity is available for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={consumerActivityChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={consumerActivityData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="consumer"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={(value: string) => shortenLabel(value, 12)}
                                        />
                                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(value, name, item) =>
                                                        name === 'orders'
                                                            ? `${value} orders`
                                                            : formatCurrency(
                                                                  Number(item.payload.amount),
                                                              )
                                                    }
                                                />
                                            }
                                        />
                                        <Bar
                                            dataKey="orders"
                                            fill="var(--color-orders)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="report-print-card border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Stock Movement Trend</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {stockMovements.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No stock movement activity is available for the selected date range.
                                </div>
                            ) : (
                                <ChartContainer
                                    config={stockMovementTrendChartConfig}
                                    className="min-h-[260px] w-full"
                                >
                                    <BarChart accessibilityLayer data={stockMovementTrendData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={formatChartDate}
                                        />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    labelFormatter={(label) =>
                                                        formatChartDate(String(label))
                                                    }
                                                    formatter={(value) =>
                                                        `${Number(value).toFixed(2)} units`
                                                    }
                                                />
                                            }
                                        />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar
                                            dataKey="stock_in"
                                            fill="var(--color-stock_in)"
                                            radius={8}
                                        />
                                        <Bar
                                            dataKey="stock_out"
                                            fill="var(--color-stock_out)"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="report-print-card">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <CardTitle>Inventory Summary</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => exportCsv('inventory')}
                            className="print:hidden"
                        >
                            Export CSV
                        </Button>
                    </CardHeader>

                    <CardContent className="report-print-table">
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

                <Card className="report-print-card">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <CardTitle>Order History</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => exportCsv('orders')}
                            className="print:hidden"
                        >
                            Export CSV
                        </Button>
                    </CardHeader>

                    <CardContent className="report-print-table">
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

                <Card className="report-print-card">
                    <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <CardTitle>Stock Movements</CardTitle>

                        <div className="flex gap-2 print:hidden">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => exportCsv('stock-movements')}
                            >
                                Export CSV
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="report-print-table">
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
