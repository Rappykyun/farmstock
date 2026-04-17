import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import AdminLayout from '@/layouts/admin-layout';
import { index } from '@/routes/admin/activity';
import type { BreadcrumbItem } from '@/types';

type UserOption = {
    id: number;
    name: string;
    email: string;
};

type ActivityRow = {
    id: number;
    log_name: string | null;
    description: string | null;
    event: string | null;
    subject_type: string | null;
    subject_id: number | null;
    causer_name: string | null;
    causer_email: string | null;
    properties: Record<string, unknown>;
    created_at: string | null;
};

type Props = {
    filters: {
        user_id: string;
        action: string;
        from: string;
        to: string;
    };
    users: UserOption[];
    actions: string[];
    activities: {
        data: ActivityRow[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity',
        href: '/admin/activity',
    },
];

export default function AdminActivityIndex({
    filters,
    users,
    actions,
    activities,
}: Props) {
    const [userId, setUserId] = useState(filters.user_id || 'all');
    const [action, setAction] = useState(filters.action || 'all');
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const applyFilters = () => {
        router.get(
            index.url(),
            {
                user_id: userId === 'all' ? '' : userId,
                action: action === 'all' ? '' : action,
                from,
                to,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Monitor" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Activity Monitor</h1>
                    <p className="text-sm text-muted-foreground">
                        Review recent model changes across users, products, and orders.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-4 md:grid-cols-5">
                        <div className="grid gap-2">
                            <Label htmlFor="user_id">User</Label>
                            <Select value={userId} onValueChange={setUserId}>
                                <SelectTrigger id="user_id">
                                    <SelectValue placeholder="All users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All users</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="action">Action</Label>
                            <Select value={action} onValueChange={setAction}>
                                <SelectTrigger id="action">
                                    <SelectValue placeholder="All actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All actions</SelectItem>
                                    {actions.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="from">From</Label>
                            <Input
                                id="from"
                                type="date"
                                value={from}
                                onChange={(event) => setFrom(event.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="to">To</Label>
                            <Input
                                id="to"
                                type="date"
                                value={to}
                                onChange={(event) => setTo(event.target.value)}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button type="button" onClick={applyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Activity Stream</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {activities.data.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No activity logs found for the current filters.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>When</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>Log</TableHead>
                                        <TableHead>Properties</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {activities.data.map((activity) => (
                                        <TableRow key={activity.id}>
                                            <TableCell>{activity.created_at ?? 'N/A'}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {activity.causer_name ?? 'System'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.causer_email ?? 'No email'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {activity.event ?? activity.description ?? 'unknown'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {activity.subject_type ?? 'Unknown'}
                                                {activity.subject_id ? ` #${activity.subject_id}` : ''}
                                            </TableCell>
                                            <TableCell>{activity.log_name ?? 'default'}</TableCell>
                                            <TableCell className="max-w-md">
                                                <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-2 text-xs">
                                                    {JSON.stringify(activity.properties, null, 2)}
                                                </pre>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {activities.links.map((link, indexKey) => (
                                <Button
                                    key={`${link.label}-${indexKey}`}
                                    asChild={link.url !== null}
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={link.url === null}
                                    size="sm"
                                >
                                    {link.url ? (
                                        <a
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
