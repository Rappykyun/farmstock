import { Head, Link, router } from '@inertiajs/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index, show } from '@/routes/products';
import type { BreadcrumbItem } from '@/types';

type ProductRow = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    current_stock: string;
    category: string | null;
    unit: string | null;
    farmer_name: string | null;
    image: string | null;
};

type CategoryOption = {
    id: number;
    name: string;
    slug: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    filters: {
        search: string;
        category: string;
        sort: string;
    };
    categories: CategoryOption[];
    products: {
        data: ProductRow[];
        links: PaginationLink[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: index.url(),
    },
];

export default function ProductBrowseIndex({
    filters,
    categories,
    products,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [category, setCategory] = useState(filters.category || 'all');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = (next: {
        search?: string;
        category?: string;
        sort?: string;
    }) => {
        const query = {
            search: next.search ?? search,
            category: next.category ?? category,
            sort: next.sort ?? sort,
        };

        router.get(
            index.url(),
            {
                ...query,
                category: query.category === 'all' ? '' : query.category,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-3">
                        <Badge variant="outline">FarmStock Catalog</Badge>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Browse fresh farm products
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                            Explore available listings from local farmers. Filter by
                            category, sort results, and open a product to view details.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <SlidersHorizontal className="h-5 w-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                applyFilters({ search });
                                            }
                                        }}
                                        placeholder="Search products"
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={category}
                                    onValueChange={(value) => {
                                        setCategory(value);
                                        applyFilters({ category: value });
                                    }}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All categories</SelectItem>
                                        {categories.map((item) => (
                                            <SelectItem key={item.id} value={item.slug}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sort">Sort</Label>
                                <Select
                                    value={sort}
                                    onValueChange={(value) => {
                                        setSort(value);
                                        applyFilters({ sort: value });
                                    }}
                                >
                                    <SelectTrigger id="sort">
                                        <SelectValue placeholder="Latest" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Latest</SelectItem>
                                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                        <SelectItem value="name_asc">Name: A to Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>

                        <CardFooter className="justify-end">
                            <Button type="button" onClick={() => applyFilters({ search })}>
                                Apply Search
                            </Button>
                        </CardFooter>
                    </Card>

                    {products.data.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-sm text-muted-foreground">
                                No products found for the current filters.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {products.data.map((product) => (
                                <Card key={product.id} className="overflow-hidden">
                                    <div className="aspect-[4/3] overflow-hidden bg-muted">
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

                                    <CardHeader className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {product.category && (
                                                <Badge variant="secondary">
                                                    {product.category}
                                                </Badge>
                                            )}
                                            <Badge variant="outline">
                                                Stock: {product.current_stock}{' '}
                                                {product.unit ?? ''}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1">
                                            <CardTitle className="line-clamp-1">
                                                {product.name}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                By {product.farmer_name ?? 'Unknown farmer'}
                                            </p>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <p className="line-clamp-3 text-sm text-muted-foreground">
                                            {product.description || 'No description available.'}
                                        </p>

                                        <div className="text-xl font-semibold">
                                            PHP {product.price}
                                        </div>
                                    </CardContent>

                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <Link href={show.url(product.id)}>
                                                View Product
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {products.links.map((link, indexKey) => (
                            <Button
                                key={`${link.label}-${indexKey}`}
                                asChild={link.url !== null}
                                variant={link.active ? 'default' : 'outline'}
                                disabled={link.url === null}
                                size="sm"
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
