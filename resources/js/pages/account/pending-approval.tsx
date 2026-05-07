import { Form, Head, usePage } from '@inertiajs/react';
import { Clock, LogOut, MailCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logout } from '@/routes';
import type { User } from '@/types';

export default function PendingApproval() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const approvalStatus = String(auth.user.approval_status ?? 'pending');
    const isRejected = approvalStatus === 'rejected';

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Head title={isRejected ? 'Account rejected' : 'Pending approval'} />

            <Card className="w-full max-w-xl">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <Badge variant={isRejected ? 'destructive' : 'secondary'}>
                                {isRejected ? 'Rejected' : 'Pending approval'}
                            </Badge>
                            <CardTitle>
                                {isRejected
                                    ? 'Your account was not approved'
                                    : 'Your account is waiting for admin approval'}
                            </CardTitle>
                            <CardDescription>
                                FarmStock reviews farmer and consumer accounts before granting marketplace access.
                            </CardDescription>
                        </div>
                        {isRejected ? <MailCheck /> : <Clock />}
                    </div>
                </CardHeader>

                <CardContent>
                    <Alert>
                        <AlertTitle>
                            {isRejected ? 'Contact the administrator' : 'You can sign in, but access is limited'}
                        </AlertTitle>
                        <AlertDescription>
                            {isRejected
                                ? 'Please contact FarmStock support or the system administrator if this was a mistake.'
                                : 'An administrator needs to approve your account before you can access products, orders, dashboards, and farmer tools.'}
                        </AlertDescription>
                    </Alert>
                </CardContent>

                <CardFooter className="flex justify-end">
                    <Form {...logout.form()}>
                        <Button type="submit" variant="outline">
                            <LogOut data-icon="inline-start" />
                            Log out
                        </Button>
                    </Form>
                </CardFooter>
            </Card>
        </main>
    );
}
