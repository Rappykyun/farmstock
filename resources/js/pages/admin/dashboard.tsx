import { Head } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    stats: {
        total_users: number;
        admin_users: number;
        farmer_users: number;
        consumer_users: number;
        total_products: number;
        pending_orders: number;
        total_categories: number;
        total_units: number;
        total_statuses: number;
    };
    recentActivity: Array<{
        title: string;
        description: string;
        time: string | null;
    }>;
    orderVolume: Array<{
        date: string;
        orders: number;
    }>;
    userBreakdown: Array<{
        role: string;
        total: number;
    }>;
    catalogBreakdown: Array<{
        label: string;
        total: number;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

const orderVolumeChartConfig = {
    orders: {
        label: 'Orders',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

const userBreakdownChartConfig = {
    total: {
        label: 'Users',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const catalogBreakdownChartConfig = {
    total: {
        label: 'Records',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

const formatChartDate = (value: string) =>
    new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(`${value}T00:00:00`));

export default function AdminDashboard({
    stats,
    recentActivity,
    orderVolume,
    userBreakdown,
    catalogBreakdown,
}: Props) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of platform setup, users, and current operational totals.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.total_users}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                All registered accounts
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.total_products}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Total product listings on the platform
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.pending_orders}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Open order requests awaiting action
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Setup Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                    Categories: {stats.total_categories}
                                </Badge>
                                <Badge variant="outline">
                                    Units: {stats.total_units}
                                </Badge>
                                <Badge variant="outline">
                                    Statuses: {stats.total_statuses}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={orderVolumeChartConfig} className="min-h-[280px] w-full">
                                <LineChart accessibilityLayer data={orderVolume}>
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
                                        cursor={false}
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
                                        dataKey="orders"
                                        stroke="var(--color-orders)"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={userBreakdownChartConfig}
                                    className="min-h-[220px] w-full"
                                >
                                    <BarChart accessibilityLayer data={userBreakdown}>
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
                                <CardTitle>Platform Records</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={catalogBreakdownChartConfig}
                                    className="min-h-[220px] w-full"
                                >
                                    <BarChart accessibilityLayer data={catalogBreakdown}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="label"
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
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No recent setup activity yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((item, index) => (
                                    <div
                                        key={`${item.title}-${index}`}
                                        className="flex items-start justify-between gap-4 rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {item.time ?? 'Just now'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
