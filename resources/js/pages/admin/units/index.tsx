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
import { destroy, store, update } from '@/routes/admin/units';
import type { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

type Unit = {
    id: number;
    name: string;
    abbreviation: string;
    description: string | null;
    is_active: boolean;
    created_at: string | null;
};

type Props = {
    units: Unit[];
};

type UnitFormData = {
    name: string;
    abbreviation: string;
    description: string;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Units',
        href: '/admin/units',
    },
];

const defaultFormData: UnitFormData = {
    name: '',
    abbreviation: '',
    description: '',
    is_active: true,
};

export default function UnitsIndex({ units }: Props) {
    const [open, setOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);

    const form = useForm<UnitFormData>(defaultFormData);

    const resetForm = () => {
        form.setData(defaultFormData);
        form.clearErrors();
        setEditingUnit(null);
    };

    const openCreateModal = () => {
        resetForm();
        setOpen(true);
    };

    const openEditModal = (unit: Unit) => {
        setEditingUnit(unit);
        form.setData({
            name: unit.name,
            abbreviation: unit.abbreviation,
            description: unit.description ?? '',
            is_active: unit.is_active,
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
        if (editingUnit) {
            form.put(update.url(editingUnit.id), {
                onSuccess: () => {
                    closeModal(false);
                    toast.success(`Unit "${editingUnit.name}" updated.`);
                },
                onError: () => toast.error('Unit update failed.'),
            });

            return;
        }

        form.post(store.url(), {
            onSuccess: () => {
                closeModal(false);
                toast.success('Unit created.');
            },
            onError: () => toast.error('Unit creation failed.'),
        });
    };

    const removeUnit = (unit: Unit) => {
        setDeletingUnit(unit);
    };

    const confirmDeleteUnit = () => {
        if (!deletingUnit) {
            return;
        }

        router.delete(destroy.url(deletingUnit.id), {
            onSuccess: () => {
                toast.success(`Unit "${deletingUnit.name}" deleted.`);
                setDeletingUnit(null);
            },
            onError: () => toast.error('Unit deletion failed.'),
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Units" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Units</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage measurement units used by product listings.
                        </p>
                    </div>

                    <Button onClick={openCreateModal}>New Unit</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Unit List</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {units.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No units yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="px-4 py-3 font-medium">Name</th>
                                            <th className="px-4 py-3 font-medium">Abbreviation</th>
                                            <th className="px-4 py-3 font-medium">Description</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-border">
                                        {units.map((unit) => (
                                            <tr key={unit.id}>
                                                <td className="px-4 py-3 font-medium">
                                                    {unit.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {unit.abbreviation}
                                                </td>
                                                <td className="max-w-xs px-4 py-3 text-muted-foreground">
                                                    {unit.description || 'No description'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={
                                                            unit.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {unit.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditModal(unit)}
                                                        >
                                                            Edit
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeUnit(unit)}
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
                            {editingUnit ? 'Edit Unit' : 'Create Unit'}
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the unit details below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="Kilogram"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="abbreviation">Abbreviation</Label>
                            <Input
                                id="abbreviation"
                                value={form.data.abbreviation}
                                onChange={(event) =>
                                    form.setData('abbreviation', event.target.value)
                                }
                                placeholder="kg"
                            />
                            <InputError message={form.errors.abbreviation} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData('description', event.target.value)
                                }
                                placeholder="Optional notes about this unit"
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
                            <Label htmlFor="is_active">Active unit</Label>
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
                            {editingUnit ? 'Save Changes' : 'Create Unit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmActionDialog
                open={deletingUnit !== null}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setDeletingUnit(null);
                    }
                }}
                title="Delete unit?"
                description={
                    deletingUnit
                        ? `This will permanently remove "${deletingUnit.name}".`
                        : ''
                }
                confirmLabel="Delete"
                destructive
                onConfirm={confirmDeleteUnit}
            />
        </AdminLayout>
    );
}
