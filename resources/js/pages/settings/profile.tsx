import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import SettingsPageLayout from '@/layouts/settings/page-layout';
import { edit, update } from '@/routes/profile';
import type { BreadcrumbItem, User } from '@/types';

export default function Profile({
}: Record<string, never>) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const role = auth.user.primary_role;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Settings',
            href: '/settings',
        },
        {
            title: 'Profile Settings',
            href: edit(),
        },
    ];
    const form = useForm<{
        name: string;
        email: string;
        avatar: File | null;
    }>({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null,
    });
    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    if (role === 'admin') {
        breadcrumbs.unshift({ title: 'Admin Dashboard', href: '/admin/dashboard' });
    } else if (role === 'farmer') {
        breadcrumbs.unshift({ title: 'Farmer Dashboard', href: '/farmer/dashboard' });
    }

    return (
        <SettingsPageLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();

                            form.transform((data) => ({
                                ...data,
                                _method: 'patch',
                            }));

                            form.post(update.url(), {
                                forceFormData: true,
                                preserveScroll: true,
                            });
                        }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 rounded-2xl border bg-muted/20 p-4">
                            <Avatar className="h-16 w-16 rounded-full">
                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="avatar">Profile photo</Label>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        form.setData('avatar', event.target.files?.[0] ?? null)
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload a square image for the best result. Max 2MB.
                                </p>
                                <InputError className="mt-1" message={form.errors.avatar} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                name="name"
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError
                                className="mt-2"
                                message={form.errors.name}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                name="email"
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError
                                className="mt-2"
                                message={form.errors.email}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={form.processing}
                                data-test="update-profile-button"
                            >
                                Save
                            </Button>

                            <Transition
                                show={form.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </SettingsPageLayout>
    );
}
