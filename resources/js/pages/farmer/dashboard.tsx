import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Boxes, PackagePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FarmerLayout from '@/layouts/farmer-layout';
import { index as inventoryIndex } from '@/routes/farmer/inventory';
import { create as createProduct } from '@/routes/farmer/products';
import type { BreadcrumbItem } from '@/types';

type LowStockAlert = {
    id: number;
    name: string;
    current_stock: string;
    unit: string | null;
    is_active: boolean;
};

type RecentInventoryChange = {
    id: number;
    product_name: string | null;
    unit: string | null;
    quantity_change: string;
    quantity_after: string;
    reason: string;
    created_at: string | null;
};

type Props = {
    stats: {
        my_products: number;
        low_stock_count: number;
        incoming_orders: number;
        active_products: number;
    };
    lowStockAlerts: LowStockAlert[];
    recentInventoryChanges: RecentInventoryChange[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Farmer Dashboard',
        href: '/farmer/dashboard',
    },
];

export default function FarmerDashboard({
    stats,
    lowStockAlerts,
    recentInventoryChanges,
}: Props) {
    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Farmer Dashboard" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Farmer Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Overview of your products, stock health, and recent inventory activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href={createProduct.url()}>
                                <PackagePlus className="mr-2 h-4 w-4" />
                                Add Product
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href={inventoryIndex.url()}>
                                <Boxes className="mr-2 h-4 w-4" />
                                Update Stock
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.my_products}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Total registered products
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.active_products}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Listings currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Low-Stock Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.low_stock_count}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Products at or below 10 units
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Incoming Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.incoming_orders}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Order flow not built yet
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Low-Stock Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            {lowStockAlerts.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No low-stock alerts right now.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lowStockAlerts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.current_stock} {product.unit ?? ''}
                                                </p>
                                            </div>

                                            <Badge
                                                variant={
                                                    product.is_active ? 'secondary' : 'outline'
                                                }
                                            >
                                                {product.is_active ? 'Low stock' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Inventory Changes</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {recentInventoryChanges.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No inventory activity yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentInventoryChanges.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        {entry.product_name ?? 'Unknown product'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {Number(entry.quantity_change) > 0
                                                            ? `+${entry.quantity_change}`
                                                            : entry.quantity_change}{' '}
                                                        {entry.unit ?? ''}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {entry.reason}
                                                    </p>
                                                </div>

                                                <div className="text-right text-sm text-muted-foreground">
                                                    <p>
                                                        After: {entry.quantity_after} {entry.unit ?? ''}
                                                    </p>
                                                    <p>{entry.created_at ?? 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FarmerLayout>
    );
}
