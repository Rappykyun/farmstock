import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Units',
        href: '/admin/units',
    },
];

export default function UnitsIndex({ units }: Props) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Units" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Units</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder index page for the backend CRUD step.
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">
                        Total units: {units.length}
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
