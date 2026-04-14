import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import FarmerLayout from '@/layouts/farmer-layout';
import { update } from '@/routes/farmer/products/inventory';
import type { BreadcrumbItem } from '@/types';

type InventoryHistory = {
    id: number;
    quantity_change: string;
    quantity_after: string;
    reason: string;
    logged_by: string | null;
    created_at: string | null;
};

type ProductRow = {
    id: number;
    name: string;
    current_stock: string;
    unit: string | null;
    is_active: boolean;
    updated_at: string | null;
    history: InventoryHistory[];
};

type Props = {
    products: ProductRow[];
};

type InventoryFormData = {
    action: 'add' | 'subtract';
    quantity: string;
    reason: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: '/farmer/inventory',
    },
];

export default function InventoryIndex({ products }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);

    const form = useForm<InventoryFormData>({
        action: 'add',
        quantity: '',
        reason: '',
    });

    const lowStockProducts = useMemo(() => {
        return products.filter((product) => Number(product.current_stock) <= 10);
    }, [products]);

    const openModal = (product: ProductRow, action: 'add' | 'subtract' = 'add') => {
        setSelectedProduct(product);
        form.setData({
            action,
            quantity: '',
            reason: '',
        });
        form.clearErrors();
        setOpen(true);
    };

    const closeModal = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            setSelectedProduct(null);
            form.reset();
            form.clearErrors();
        }
    };

    const submit = () => {
        if (!selectedProduct) {
            return;
        }

        form.patch(update.url(selectedProduct.id), {
            onSuccess: () => closeModal(false),
        });
    };

    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Inventory</h1>
                    <p className="text-sm text-muted-foreground">
                        Track stock levels, adjust quantities, and review recent changes.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tracked Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{products.length}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Products with inventory records
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Low Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">{lowStockProducts.length}</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Products at or below 10 units
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Listings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold">
                                {products.filter((product) => product.is_active).length}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Inventory-ready active products
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Stock Overview</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {products.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No products available for inventory tracking yet.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Current Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>

                                            <TableCell>
                                                <div className="font-medium">
                                                    {product.current_stock} {product.unit ?? ''}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        Number(product.current_stock) <= 10
                                                            ? 'secondary'
                                                            : 'default'
                                                    }
                                                >
                                                    {Number(product.current_stock) <= 10
                                                        ? 'Low stock'
                                                        : 'In stock'}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {product.updated_at ?? 'N/A'}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openModal(product, 'add')}
                                                    >
                                                        Add
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openModal(product, 'subtract')
                                                        }
                                                    >
                                                        Subtract
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

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Inventory History</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {products.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    No inventory history yet.
                                </div>
                            ) : (
                                products.map((product) => (
                                    <div key={product.id} className="rounded-xl border p-4">
                                        <div className="mb-4 flex items-center justify-between gap-4">
                                            <div>
                                                <h2 className="font-semibold">{product.name}</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Current stock: {product.current_stock}{' '}
                                                    {product.unit ?? ''}
                                                </p>
                                            </div>

                                            <Badge variant="outline">
                                                {product.history.length} entries
                                            </Badge>
                                        </div>

                                        {product.history.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No stock changes recorded yet.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {product.history.map((entry) => (
                                                    <div
                                                        key={entry.id}
                                                        className="rounded-lg border p-3"
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="space-y-1">
                                                                <p className="font-medium">
                                                                    {Number(entry.quantity_change) > 0
                                                                        ? `+${entry.quantity_change}`
                                                                        : entry.quantity_change}{' '}
                                                                    {product.unit ?? ''}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {entry.reason}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    By {entry.logged_by ?? 'Unknown'}
                                                                </p>
                                                            </div>

                                                            <div className="text-right text-sm text-muted-foreground">
                                                                <p>
                                                                    After: {entry.quantity_after}{' '}
                                                                    {product.unit ?? ''}
                                                                </p>
                                                                <p>{entry.created_at ?? 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={open} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Stock</DialogTitle>
                        <DialogDescription>
                            {selectedProduct
                                ? `Adjust stock for ${selectedProduct.name}.`
                                : 'Adjust product stock.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                            <div className="font-medium">
                                {selectedProduct?.name ?? 'No product selected'}
                            </div>
                            <div className="text-muted-foreground">
                                Current stock: {selectedProduct?.current_stock ?? '0'}{' '}
                                {selectedProduct?.unit ?? ''}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="action">Action</Label>
                            <Select
                                value={form.data.action}
                                onValueChange={(value) =>
                                    form.setData('action', value as 'add' | 'subtract')
                                }
                            >
                                <SelectTrigger id="action">
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="add">Add stock</SelectItem>
                                    <SelectItem value="subtract">Subtract stock</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.action} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.data.quantity}
                                onChange={(event) =>
                                    form.setData('quantity', event.target.value)
                                }
                                placeholder="0.00"
                            />
                            <InputError message={form.errors.quantity} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                id="reason"
                                value={form.data.reason}
                                onChange={(event) =>
                                    form.setData('reason', event.target.value)
                                }
                                placeholder="Restocked from harvest, damaged stock removed, etc."
                            />
                            <InputError message={form.errors.reason} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => closeModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={submit}
                            disabled={form.processing}
                        >
                            Save Stock Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </FarmerLayout>
    );
}
