import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { create, destroy, edit } from '@/routes/farmer/products';
import type { BreadcrumbItem } from '@/types';
import FarmerLayout from '@/layouts/farmer-layout';

type ProductRow = {
    id: number;
    name: string;
    category: string | null;
    unit: string | null;
    status: string | null;
    price: string;
    is_active: boolean;
    created_at: string | null;
};

type Props = {
    products: ProductRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/farmer/products',
    },
];

export default function ProductsIndex({ products }: Props) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    products
                        .map((product) => product.category)
                        .filter((value): value is string => Boolean(value)),
                ),
            ).sort(),
        [products],
    );

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                search === '' ||
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                (product.status ?? '').toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                category === 'all' || product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [category, products, search]);

    const removeProduct = (product: ProductRow) => {
        if (!window.confirm(`Delete product "${product.name}"?`)) {
            return;
        }

        router.delete(destroy.url(product.id));
    };

    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Products</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your registered products and keep listings current.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={create.url()}>New Product</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Product List</CardTitle>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search products"
                                className="w-full sm:w-64"
                            />

                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full sm:w-52">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {categories.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {filteredProducts.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No products match the current filters.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Availability</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell>
                                                {product.category ?? 'Uncategorized'}
                                            </TableCell>
                                            <TableCell>{product.unit ?? 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {product.status ?? 'No status'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>PHP {product.price}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        product.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={edit.url(product.id)}>
                                                            Edit
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeProduct(product)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
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
