import { router, Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
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
import FarmerLayout from '@/layouts/farmer-layout';
import { index, update } from '@/routes/farmer/products';
import { destroy as destroyImage, store as storeImage } from '@/routes/farmer/products/images';
import type { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

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

type ProductImage = {
    id: number;
    path: string;
    is_primary: boolean;
    sort_order: number;
    url: string;
    thumbnail_url: string;
};

type ProductData = {
    id: number;
    category_id: number;
    unit_id: number;
    status_id: number;
    name: string;
    description: string | null;
    price: string;
    is_active: boolean;
    images: ProductImage[];
};


type Props = {
    product: ProductData;
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
        title: 'Edit Product',
        href: '/farmer/products',
    },
];

export default function EditProduct({
    product,
    categories,
    units,
    statuses,
}: Props) {
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
    const form = useForm<ProductFormData>({
        category_id: String(product.category_id),
        unit_id: String(product.unit_id),
        status_id: String(product.status_id),
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        is_active: product.is_active,
    });
    const imageForm = useForm<{
        images: File[];
    }>({
        images: [],
    });

    const submit = () => {
        form.transform((data) => ({
            ...data,
            category_id: Number(data.category_id),
            unit_id: Number(data.unit_id),
            status_id: Number(data.status_id),
        }));

        form.put(update.url(product.id), {
            onSuccess: () => toast.success('Product changes saved.'),
            onError: () => toast.error('Product update failed.'),
        });
    };

    const uploadImages = () => {
        if (imageForm.data.images.length === 0) {
            return;
        }

        imageForm.post(storeImage.url(product.id), {
            forceFormData: true,
            onSuccess: () => {
                imageForm.reset();
                toast.success('Images uploaded.');
            },
            onError: () => toast.error('Image upload failed.'),
        });
    };

    const removeImage = (imageId: number) => {
        setDeletingImageId(imageId);
    };

    const confirmDeleteImage = () => {
        if (deletingImageId === null) {
            return;
        }

        router.delete(destroyImage.url([product.id, deletingImageId]), {
            onSuccess: () => {
                toast.success('Image deleted.');
                setDeletingImageId(null);
            },
            onError: () => toast.error('Image deletion failed.'),
        });
    };

    return (
        <FarmerLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Product</h1>
                        <p className="text-sm text-muted-foreground">
                            Update your product details and listing status.
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
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="images">Upload Images</Label>
                            <Input
                                id="images"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                onChange={(event) =>
                                    imageForm.setData(
                                        'images',
                                        Array.from(event.target.files ?? []),
                                    )
                                }
                            />
                            <p className="text-sm text-muted-foreground">
                                JPG, JPEG, or PNG only. Maximum 5MB per image.
                            </p>
                            <InputError message={imageForm.errors.images} />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={uploadImages}
                                disabled={
                                    imageForm.processing ||
                                    imageForm.data.images.length === 0
                                }
                            >
                                Upload Images
                            </Button>
                        </div>

                        {product.images.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No images uploaded yet.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {product.images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="space-y-3 rounded-xl border p-3"
                                    >
                                        <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                                            <img
                                                src={image.thumbnail_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            {image.is_primary ? (
                                                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                                    Primary
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    Image #{image.sort_order}
                                                </span>
                                            )}

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeImage(image.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmActionDialog
                open={deletingImageId !== null}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setDeletingImageId(null);
                    }
                }}
                title="Delete image?"
                description="This image will be removed from the product gallery."
                confirmLabel="Delete"
                destructive
                onConfirm={confirmDeleteImage}
            />
        </FarmerLayout>
    );
}
