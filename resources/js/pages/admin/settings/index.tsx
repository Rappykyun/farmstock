import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { update } from '@/routes/admin/settings';
import type { BreadcrumbItem } from '@/types';

type SettingRow = {
    id: number;
    key: string;
    value: string | null;
    type: string;
    description: string | null;
};

type Props = {
    settings: SettingRow[];
};

type FormData = {
    settings: Array<{
        key: string;
        value: string;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/admin/settings',
    },
];

export default function AdminSettingsIndex({ settings }: Props) {
    const form = useForm<FormData>({
        settings: settings.map((setting) => ({
            key: setting.key,
            value: setting.value ?? '',
        })),
    });

    const updateValue = (key: string, value: string) => {
        form.setData(
            'settings',
            form.data.settings.map((setting) =>
                setting.key === key ? { ...setting, value } : setting,
            ),
        );
    };

    const valueFor = (key: string) =>
        form.data.settings.find((setting) => setting.key === key)?.value ?? '';

    const submit = () => {
        form.patch(update.url());
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">System Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Configure toggleable platform behavior from one place.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {settings.map((setting) => (
                            <div key={setting.id} className="grid gap-2">
                                <Label htmlFor={setting.key}>{setting.key}</Label>
                                <Input
                                    id={setting.key}
                                    value={valueFor(setting.key)}
                                    onChange={(event) =>
                                        updateValue(setting.key, event.target.value)
                                    }
                                />
                                <p className="text-sm text-muted-foreground">
                                    {setting.description ?? 'No description'}
                                </p>
                            </div>
                        ))}

                        <InputError
                            message={typeof form.errors.settings === 'string' ? form.errors.settings : undefined}
                        />

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={form.processing}
                            >
                                Save Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
