import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { destroy, store, update } from '@/routes/admin/statuses';
import type { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

type StatusType = 'product' | 'inventory' | 'order';

type Status = {
    id: number;
    name: string;
    slug: string;
    type: StatusType;
    color: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
};

type Props = {
    statuses: Status[];
};

type StatusFormData = {
    name: string;
    type: StatusType;
    color: string;
    description: string;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Statuses',
        href: '/admin/statuses',
    },
];

const defaultFormData: StatusFormData = {
    name: '',
    type: 'product',
    color: '#6B7280',
    description: '',
    is_active: true,
};

export default function StatusesIndex({ statuses }: Props) {
    const [open, setOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<Status | null>(null);
    const [selectedType, setSelectedType] = useState<'all' | StatusType>('all');
    const [deletingStatus, setDeletingStatus] = useState<Status | null>(null);

    const form = useForm<StatusFormData>(defaultFormData);

    const filteredStatuses = useMemo(() => {
        if (selectedType === 'all') {
            return statuses;
        }

        return statuses.filter((status) => status.type === selectedType);
    }, [selectedType, statuses]);

    const resetForm = () => {
        form.setData(defaultFormData);
        form.clearErrors();
        setEditingStatus(null);
    };

    const openCreateModal = () => {
        resetForm();
        setOpen(true);
    };

    const openEditModal = (status: Status) => {
        setEditingStatus(status);
        form.setData({
            name: status.name,
            type: status.type,
            color: status.color,
            description: status.description ?? '',
            is_active: status.is_active,
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
        if (editingStatus) {
            form.put(update.url(editingStatus.id), {
                onSuccess: () => {
                    closeModal(false);
                    toast.success(`Status "${editingStatus.name}" updated.`);
                },
                onError: () => toast.error('Status update failed.'),
            });

            return;
        }

        form.post(store.url(), {
            onSuccess: () => {
                closeModal(false);
                toast.success('Status created.');
            },
            onError: () => toast.error('Status creation failed.'),
        });
    };

    const removeStatus = (status: Status) => {
        setDeletingStatus(status);
    };

    const confirmDeleteStatus = () => {
        if (!deletingStatus) {
            return;
        }

        router.delete(destroy.url(deletingStatus.id), {
            onSuccess: () => {
                toast.success(`Status "${deletingStatus.name}" deleted.`);
                setDeletingStatus(null);
            },
            onError: () => toast.error('Status deletion failed.'),
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Statuses" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Statuses</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage status labels for products, inventory, and orders.
                        </p>
                    </div>

                    <Button onClick={openCreateModal}>New Status</Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Status List</CardTitle>

                        <div className="w-full sm:w-56">
                            <Select
                                value={selectedType}
                                onValueChange={(value) =>
                                    setSelectedType(value as 'all' | StatusType)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="product">Product</SelectItem>
                                    <SelectItem value="inventory">Inventory</SelectItem>
                                    <SelectItem value="order">Order</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {filteredStatuses.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No statuses found for this filter.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">Name</th>
                                            <th className="px-4 py-3 font-medium">Type</th>
                                            <th className="px-4 py-3 font-medium">Color</th>
                                            <th className="px-4 py-3 font-medium">Slug</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-border">
                                        {filteredStatuses.map((status) => (
                                            <tr key={status.id}>
                                                <td className="px-4 py-3 font-medium">
                                                    {status.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline">
                                                        {status.type}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="inline-block h-4 w-4 rounded-full border"
                                                            style={{ backgroundColor: status.color }}
                                                        />
                                                        <span className="text-muted-foreground">
                                                            {status.color}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {status.slug}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={
                                                            status.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {status.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditModal(status)}
                                                        >
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeStatus(status)}
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
                            {editingStatus ? 'Edit Status' : 'Create Status'}
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the status details below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="Available"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={form.data.type}
                                onValueChange={(value) =>
                                    form.setData('type', value as StatusType)
                                }
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select a status type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="product">Product</SelectItem>
                                    <SelectItem value="inventory">Inventory</SelectItem>
                                    <SelectItem value="order">Order</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="color">Color</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    id="color"
                                    type="color"
                                    value={form.data.color}
                                    onChange={(event) => form.setData('color', event.target.value)}
                                    className="h-10 w-16 p-1"
                                />
                                <Input
                                    value={form.data.color}
                                    onChange={(event) => form.setData('color', event.target.value)}
                                    placeholder="#6B7280"
                                />
                            </div>
                            <InputError message={form.errors.color} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData('description', event.target.value)
                                }
                                placeholder="Optional notes about this status"
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
                            <Label htmlFor="is_active">Active status</Label>
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
                            {editingStatus ? 'Save Changes' : 'Create Status'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmActionDialog
                open={deletingStatus !== null}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setDeletingStatus(null);
                    }
                }}
                title="Delete status?"
                description={
                    deletingStatus
                        ? `This will permanently remove "${deletingStatus.name}".`
                        : ''
                }
                confirmLabel="Delete"
                destructive
                onConfirm={confirmDeleteStatus}
            />
        </AdminLayout>
    );
}
