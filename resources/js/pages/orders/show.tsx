import { Head } from '@inertiajs/react';

type Props = {
    request: {
        id: number;
        status: string | null;
        total_amount: string;
    };
};

export default function OrderRequestShow({ request }: Props) {
    return (
        <>
            <Head title={`Request #${request.id}`} />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">
                        Request #{request.id}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder page for the backend order request step.
                    </p>
                </div>
            </div>
        </>
    );
}
