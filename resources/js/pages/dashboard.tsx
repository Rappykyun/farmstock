import { Head, Link } from '@inertiajs/react';
import { Clock3, PackageSearch, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index as ordersIndex, show as ordersShow } from '@/routes/orders';
import { index as productsIndex, show as productsShow } from '@/routes/products';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type RequestRow = {
    id: number;
    farmer_name: string | null;
    status: string | null;
    status_slug: string | null;
    status_color: string | null;
    total_amount: string;
    created_at: string | null;
    item_count: number;
};

type FeaturedProduct = {
    id: number;
    name: string;
    price: string;
    current_stock: string;
    category: string | null;
    farmer_name: string | null;
    image: string | null;
};

type Props = {
    stats: {
        total_requests: number;
        pending_requests: number;
        accepted_requests: number;
    };
    recentRequests: RequestRow[];
    featuredProducts: FeaturedProduct[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({
    stats,
    recentRequests,
    featuredProducts,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Consumer Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Track your requests and discover recently listed products.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href={productsIndex.url()}>
                                <PackageSearch className="mr-2 h-4 w-4" />
                                Browse Products
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href={ordersIndex.url()}>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                My Requests
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.total_requests}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Requests you have submitted
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.pending_requests}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Waiting for farmer action
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Accepted Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{stats.accepted_requests}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Ready or in progress
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Requests</CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={ordersIndex.url()}>View all</Link>
                            </Button>
                        </CardHeader>

                        <CardContent>
                            {recentRequests.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No order requests yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentRequests.map((request) => (
                                        <Link
                                            key={request.id}
                                            href={ordersShow.url(request.id)}
                                            className="block rounded-lg border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium">
                                                        Request #{request.id}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {request.farmer_name ?? 'Unknown farmer'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {request.item_count} item(s)
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <Badge variant="outline">
                                                        {request.status ?? 'Unknown'}
                                                    </Badge>
                                                    <p className="mt-2 text-sm font-medium">
                                                        PHP {request.total_amount}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recently Listed Products</CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={productsIndex.url()}>Browse all</Link>
                            </Button>
                        </CardHeader>

                        <CardContent>
                            {featuredProducts.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No products available yet.
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {featuredProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={productsShow.url(product.id)}
                                            className="overflow-hidden rounded-xl border"
                                        >
                                            <div className="aspect-[4/3] bg-muted">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                        No image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2 p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {product.category && (
                                                        <Badge variant="secondary">
                                                            {product.category}
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline">
                                                        {product.current_stock} available
                                                    </Badge>
                                                </div>

                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.farmer_name ?? 'Unknown farmer'}
                                                    </p>
                                                </div>

                                                <p className="text-lg font-semibold">
                                                    PHP {product.price}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
