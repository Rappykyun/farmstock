import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import ConfirmActionDialog from '@/components/confirm-action-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import AdminLayout from '@/layouts/admin-layout';
import { destroy, store, update } from '@/routes/admin/product-categories';
import type { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

type ProductCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
};

type Props = {
    categories: ProductCategory[];
};

type CategoryFormData = {
    name: string;
    description: string;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Categories',
        href: '/admin/product-categories',
    },
];

const defaultFormData: CategoryFormData = {
    name: '',
    description: '',
    is_active: true,
};

export default function ProductCategoriesIndex({ categories }: Props) {
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<ProductCategory | null>(null);

    const form = useForm<CategoryFormData>(defaultFormData);

    const resetForm = () => {
        form.setData(defaultFormData);
        form.clearErrors();
        setEditingCategory(null);
    };

    const openCreateModal = () => {
        resetForm();
        setOpen(true);
    };

    const openEditModal = (category: ProductCategory) => {
        setEditingCategory(category);
        form.setData({
            name: category.name,
            description: category.description ?? '',
            is_active: category.is_active,
        });
        form.clearErrors();
        setOpen(true);
    };

    const closeModal = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            resetForm();
        }
    };

    const submit = () => {
        if (editingCategory) {
            form.put(update.url(editingCategory.id), {
                onSuccess: () => {
                    closeModal(false);
                    toast.success(`Category "${editingCategory.name}" updated.`);
                },
                onError: () => toast.error('Category update failed.'),
            });

            return;
        }

        form.post(store.url(), {
            onSuccess: () => {
                closeModal(false);
                toast.success('Category created.');
            },
            onError: () => toast.error('Category creation failed.'),
        });
    };

    const removeCategory = (category: ProductCategory) => {
        setDeletingCategory(category);
    };

    const confirmDeleteCategory = () => {
        if (!deletingCategory) {
            return;
        }

        router.delete(destroy.url(deletingCategory.id), {
            onSuccess: () => {
                toast.success(`Category "${deletingCategory.name}" deleted.`);
                setDeletingCategory(null);
            },
            onError: () => toast.error('Category deletion failed.'),
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Categories" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Product Categories</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage category labels for products in the catalog.
                        </p>
                    </div>

                    <Button onClick={openCreateModal}>New Category</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category List</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {categories.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No categories yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">Name</th>
                                            <th className="px-4 py-3 font-medium">Slug</th>
                                            <th className="px-4 py-3 font-medium">Description</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-border">
                                        {categories.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-4 py-3 font-medium">
                                                    {category.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {category.slug}
                                                </td>
                                                <td className="max-w-xs px-4 py-3 text-muted-foreground">
                                                    {category.description || 'No description'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={
                                                            category.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {category.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditModal(category)}
                                                        >
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeCategory(category)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={open} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Edit Category' : 'Create Category'}
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the category details below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="Vegetables"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData('description', event.target.value)
                                }
                                placeholder="Short description for this category"
                                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) =>
                                    form.setData('is_active', checked === true)
                                }
                            />
                            <Label htmlFor="is_active">Active category</Label>
                        </div>
                        <InputError message={form.errors.is_active} />
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
                            {editingCategory ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmActionDialog
                open={deletingCategory !== null}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setDeletingCategory(null);
                    }
                }}
                title="Delete category?"
                description={
                    deletingCategory
                        ? `This will permanently remove "${deletingCategory.name}".`
                        : ''
                }
                confirmLabel="Delete"
                destructive
                onConfirm={confirmDeleteCategory}
            />
        </AdminLayout>
    );
}
