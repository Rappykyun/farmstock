import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import AdminLayout from '@/layouts/admin-layout';
import { index, update } from '@/routes/admin/users';
import type { BreadcrumbItem } from '@/types';

type UserRole = 'admin' | 'farmer' | 'consumer';

type UserRow = {
    id: number;
    name: string;
    email: string;
    address: string | null;
    contact_number: string | null;
    farm_name: string | null;
    is_active: boolean;
    role: string | null;
    created_at: string | null;
};

type Props = {
    users: UserRow[];
    availableRoles: string[];
    filters: {
        role: string;
        is_active: string | null;
    };
};

type UserFormData = {
    role: UserRole;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
    },
];

export default function UsersIndex({
    users,
    availableRoles,
    filters,
}: Props) {
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRow | null>(null);

    const form = useForm<UserFormData>({
        role: 'consumer',
        is_active: true,
    });

    const initials = (name: string) =>
        name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

    const applyFilters = (
        nextFilters: Record<string, string | null | undefined>,
    ) => {
        router.get(
            index.url({
                query: Object.fromEntries(
                    Object.entries(nextFilters).filter(([, value]) => value !== '' && value !== null),
                ),
            }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const openEditModal = (user: UserRow) => {
        setEditingUser(user);
        form.setData({
            role: (user.role as UserRole | null) ?? 'consumer',
            is_active: user.is_active,
        });
        form.clearErrors();
        setOpen(true);
    };

    const closeModal = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            setEditingUser(null);
            form.reset();
            form.clearErrors();
        }
    };

    const submit = () => {
        if (!editingUser) {
            return;
        }

        form.put(update.url(editingUser.id), {
            onSuccess: () => closeModal(false),
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Users</h1>
                        <p className="text-sm text-muted-foreground">
                            Review user accounts, filter by role, and update account access.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>User Directory</CardTitle>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Select
                                value={filters.role || 'all'}
                                onValueChange={(value) =>
                                    applyFilters({
                                        role: value === 'all' ? '' : value,
                                        is_active: filters.is_active,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All roles</SelectItem>
                                    {availableRoles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.is_active ?? 'all'}
                                onValueChange={(value) =>
                                    applyFilters({
                                        role: filters.role,
                                        is_active: value === 'all' ? '' : value,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full sm:w-44">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {users.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No users found for the current filter.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Farm</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {initials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline">
                                                    {user.role ?? 'unassigned'}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        user.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                <div>{user.contact_number || 'No contact number'}</div>
                                                <div className="text-xs">{user.address || 'No address'}</div>
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {user.farm_name || 'Not a farmer'}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    Manage
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={open} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage User</DialogTitle>
                        <DialogDescription>
                            Update role assignment and account availability.
                        </DialogDescription>
                    </DialogHeader>

                    {editingUser && (
                        <div className="grid gap-4">
                            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                                <div className="font-medium">{editingUser.name}</div>
                                <div className="text-muted-foreground">{editingUser.email}</div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={form.data.role}
                                    onValueChange={(value) =>
                                        form.setData('role', value as UserRole)
                                    }
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.role} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_active"
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) =>
                                        form.setData('is_active', checked === true)
                                    }
                                />
                                <Label htmlFor="is_active">Active account</Label>
                            </div>
                            <InputError message={form.errors.is_active} />

                            <div className="grid gap-2">
                                <Label>Notes</Label>
                                <Textarea
                                    value={
                                        editingUser.farm_name
                                            ? `Farm: ${editingUser.farm_name}\nAddress: ${editingUser.address ?? 'N/A'}`
                                            : `Address: ${editingUser.address ?? 'N/A'}`
                                    }
                                    readOnly
                                    className="min-h-24"
                                />
                            </div>
                        </div>
                    )}

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
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
