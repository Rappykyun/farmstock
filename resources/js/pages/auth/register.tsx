import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [role, setRole] = useState<'consumer' | 'farmer'>('consumer');

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    name="address"
                                    placeholder="Street, barangay, municipality"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact_number">Contact number</Label>
                                <Input
                                    id="contact_number"
                                    type="text"
                                    required
                                    tabIndex={4}
                                    name="contact_number"
                                    placeholder="09XXXXXXXXX"
                                />
                                <InputError message={errors.contact_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Account type</Label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    tabIndex={5}
                                    value={role}
                                    onChange={(event) =>
                                        setRole(event.target.value as 'consumer' | 'farmer')
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    <option value="consumer">Consumer</option>
                                    <option value="farmer">Farmer</option>
                                </select>
                                <InputError message={errors.role} />
                            </div>

                            {role === 'farmer' && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="farm_name">Farm name</Label>
                                        <Input
                                            id="farm_name"
                                            type="text"
                                            required={role === 'farmer'}
                                            tabIndex={6}
                                            name="farm_name"
                                            placeholder="Your farm name"
                                        />
                                        <InputError message={errors.farm_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="farm_details">Farm details</Label>
                                        <textarea
                                            id="farm_details"
                                            name="farm_details"
                                            required={role === 'farmer'}
                                            tabIndex={7}
                                            placeholder="Tell buyers about your farm"
                                            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        />
                                        <InputError message={errors.farm_details} />
                                    </div>
                                </>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={8}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={9}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={10}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={11}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
