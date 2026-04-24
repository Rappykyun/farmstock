import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Leaf, PackageSearch, Sprout, Tractor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

type Props = {
    canRegister?: boolean;
};

type SharedProps = {
    auth: {
        user?: {
            id: number;
            name: string;
        } | null;
    };
};

const highlights = [
    {
        title: 'Easy product browsing',
        description:
            'Consumers can find available products, review details, and send requests in one flow.',
        icon: PackageSearch,
    },
    {
        title: 'Smoother farmer workflow',
        description:
            'Farmers can manage listings, stock, and incoming requests without jumping between tools.',
        icon: Tractor,
    },
    {
        title: 'Clear request tracking',
        description:
            'Both sides can stay aligned as requests move from submission to fulfillment.',
        icon: Sprout,
    },
];

const audienceSections = [
    {
        title: 'For consumers',
        description:
            'Browse available products, send requests to farmers, and keep track of your orders from a single account.',
    },
    {
        title: 'For farmers',
        description:
            'Create product listings, update stock, and respond to customer requests with a simpler day-to-day workflow.',
    },
];

export default function Welcome({ canRegister = true }: Props) {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="FarmStock">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[#f7f5ef] text-[#1f2a23]">
                <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(70,102,74,0.12),transparent_60%)]" />

                <header className="border-b border-black/5 bg-[#f7f5ef]/95 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href={auth.user ? dashboard() : '/'} className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#244131] text-white">
                                <Leaf className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#244131]">
                                    FarmStock
                                </p>
                                <p className="text-xs text-[#667267]">
                                    Better farm-to-buyer coordination
                                </p>
                            </div>
                        </Link>

                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild size="sm" className="bg-[#244131] hover:bg-[#1c3326]">
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>Log in</Link>
                                    </Button>

                                    {canRegister && (
                                        <Button asChild size="sm" className="bg-[#244131] hover:bg-[#1c3326]">
                                            <Link href={register()}>Register</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                        <div className="space-y-6">
                            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#667267]">
                                Farm marketplace made simpler
                            </p>

                            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                                A cleaner way for consumers and farmers to work together.
                            </h1>

                            <p className="max-w-2xl text-base leading-7 text-[#5c675f] sm:text-lg">
                                FarmStock helps buyers discover available products and helps farmers
                                manage listings, stock, and requests in one place.
                            </p>

                            {auth.user && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Button asChild size="lg" className="bg-[#244131] hover:bg-[#1c3326]">
                                        <Link href={dashboard()}>
                                            Open Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Card className="border-black/5 bg-white/80 shadow-none">
                            <CardContent className="space-y-5 p-6 lg:p-8">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#667267]">
                                        What you can do
                                    </p>
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Built for everyday use
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {highlights.map((item) => (
                                        <div key={item.title} className="rounded-2xl border border-black/5 bg-[#fbfaf7] p-4">
                                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#244131]/8 text-[#244131]">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="mt-1 text-sm leading-6 text-[#5c675f]">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="mt-12 grid gap-5 md:grid-cols-2">
                        {audienceSections.map((section) => (
                            <Card key={section.title} className="border-black/5 bg-white/80 shadow-none">
                                <CardContent className="space-y-3 p-6">
                                    <h2 className="text-lg font-semibold capitalize">{section.title}</h2>
                                    <p className="text-sm leading-6 text-[#5c675f]">
                                        {section.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                </main>
            </div>
        </>
    );
}
