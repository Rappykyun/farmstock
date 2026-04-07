import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index, store } from '@/routes/farmer/products';
import type { BreadcrumbItem } from '@/types';
import FarmerLayout from '@/layouts/farmer-layout';

type Option = {
    id: number;
    name: string;
};

type UnitOption = Option & {
    abbreviation: string;
};

type StatusOption = Option & {
    color: string;
};

type Props = {
    categories: Option[];
    units: UnitOption[];
    statuses: StatusOption[];
};

type ProductFormData = {
    category_id: string;
    unit_id: string;
    status_id: string;
    name: string;
    description: string;
    price: string;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Product',
        href: '/farmer/products/create',
    },
];

export default function CreateProduct({
    categories,
    units,
    statuses,
}: Props) {
    const form = useForm<ProductFormData>({
        category_id: '',
        unit_id: '',
        status_id: '',
        name: '',
        description: '',
        price: '',
        is_active: true,
    });

    const submit = () => {
        form.transform((data) => ({
            ...data,
            category_id: Number(data.category_id),
            unit_id: Number(data.unit_id),
            status_id: Number(data.status_id),
        }));
        form.post(store.url());
    };

    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Create Product</h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new product listing for your farm.
                        </p>
                    </div>

                    <Button asChild variant="outline">
                        <Link href={index.url()}>Back to Products</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="Fresh Tomatoes"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData('description', event.target.value)
                                }
                                placeholder="Describe your product"
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select
                                    value={form.data.category_id}
                                    onValueChange={(value) =>
                                        form.setData('category_id', value)
                                    }
                                >
                                    <SelectTrigger id="category_id">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.category_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unit_id">Unit</Label>
                                <Select
                                    value={form.data.unit_id}
                                    onValueChange={(value) => form.setData('unit_id', value)}
                                >
                                    <SelectTrigger id="unit_id">
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.id} value={String(unit.id)}>
                                                {unit.name} ({unit.abbreviation})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.unit_id} />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="status_id">Status</Label>
                                <Select
                                    value={form.data.status_id}
                                    onValueChange={(value) =>
                                        form.setData('status_id', value)
                                    }
                                >
                                    <SelectTrigger id="status_id">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={String(status.id)}>
                                                {status.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.status_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.price}
                                    onChange={(event) => form.setData('price', event.target.value)}
                                    placeholder="0.00"
                                />
                                <InputError message={form.errors.price} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) =>
                                    form.setData('is_active', checked === true)
                                }
                            />
                            <Label htmlFor="is_active">Active listing</Label>
                        </div>
                        <InputError message={form.errors.is_active} />

                        <div className="flex justify-end gap-2">
                            <Button asChild type="button" variant="outline">
                                <Link href={index.url()}>Cancel</Link>
                            </Button>
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={form.processing}
                            >
                                Create Product
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FarmerLayout>
    );
}
