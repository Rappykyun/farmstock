import { Head, usePage } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import SettingsLayout from '@/layouts/settings/layout';
import SettingsPageLayout from '@/layouts/settings/page-layout';
import { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem, User } from '@/types';

export default function Appearance() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Settings',
            href: '/settings',
        },
        {
            title: 'Appearance Settings',
            href: editAppearance(),
        },
    ];

    if (auth.user.primary_role === 'admin') {
        breadcrumbs.unshift({ title: 'Admin Dashboard', href: '/admin/dashboard' });
    } else if (auth.user.primary_role === 'farmer') {
        breadcrumbs.unshift({ title: 'Farmer Dashboard', href: '/farmer/dashboard' });
    }

    return (
        <SettingsPageLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </SettingsPageLayout>
    );
}
