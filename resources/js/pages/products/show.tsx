import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Phone, Store } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { login, register } from '@/routes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/products';
import { store as storeOrderRequest } from '@/routes/products/order-requests';
import type { BreadcrumbItem, User } from '@/types';

type ProductDetail = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    current_stock: string;
    category: string | null;
    unit: string | null;
    status: string | null;
    status_color: string | null;
    farmer: {
        name: string | null;
        farm_name: string | null;
        address: string | null;
        contact_number: string | null;
    };
    images: Array<{
        id: number;
        is_primary: boolean;
        url: string;
        thumbnail_url: string;
    }>;
};

type Props = {
    product: ProductDetail;
};

type OrderRequestFormData = {
    quantity: string;
    notes: string;
};

export default function ProductBrowseShow({ product }: Props) {
    const { auth } = usePage<{ auth: { user?: User | null } }>().props;
    const user = auth.user ?? null;
    const [selectedImage, setSelectedImage] = useState(
        product.images.find((image) => image.is_primary)?.url ??
            product.images[0]?.url ??
            null,
    );
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: index.url(),
        },
        {
            title: 'Product Details',
            href: index.url(),
        },
    ];

    const form = useForm<OrderRequestFormData>({
        quantity: '',
        notes: '',
    });

    const submit = () => {
        form.post(storeOrderRequest.url(product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-2">
                            <Link
                                href={index.url()}
                                className="text-sm text-muted-foreground underline"
                            >
                                Back to products
                            </Link>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {product.name}
                            </h1>
                        </div>

                        <Badge variant="outline">
                            {product.current_stock} {product.unit ?? ''} available
                        </Badge>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                            <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        No image available
                                    </div>
                                )}
                            </div>

                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((image) => (
                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() => setSelectedImage(image.url)}
                                            className="aspect-square overflow-hidden rounded-lg border bg-muted"
                                        >
                                            <img
                                                src={image.thumbnail_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardContent className="space-y-5 p-6">
                                    <div className="flex flex-wrap gap-2">
                                        {product.category && (
                                            <Badge variant="secondary">{product.category}</Badge>
                                        )}
                                        {product.status && (
                                            <Badge variant="outline">
                                                {product.status}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="text-3xl font-semibold">
                                        PHP {product.price}
                                    </div>

                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {product.description || 'No description available.'}
                                    </p>

                                    <div className="grid gap-3 rounded-xl border p-4 text-sm">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Store className="h-4 w-4" />
                                            Seller
                                        </div>
                                        <p>{product.farmer.farm_name || product.farmer.name || 'Unknown farm'}</p>
                                        <p className="text-muted-foreground">
                                            {product.farmer.address || 'No address provided'}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {product.unit
                                                ? `Sold per ${product.unit}`
                                                : 'Unit not specified'}
                                        </p>
                                        {product.farmer.contact_number && (
                                            <p className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                {product.farmer.contact_number}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="space-y-4 p-6">
                                    {user ? (
                                        <>
                                            <div>
                                                <h2 className="text-lg font-semibold">Request Order</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Submit a quantity request to this farmer.
                                                </p>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input
                                                    id="quantity"
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={form.data.quantity}
                                                    onChange={(event) =>
                                                        form.setData('quantity', event.target.value)
                                                    }
                                                    placeholder="0.00"
                                                />
                                                <InputError message={form.errors.quantity} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="notes">Notes</Label>
                                                <Textarea
                                                    id="notes"
                                                    value={form.data.notes}
                                                    onChange={(event) =>
                                                        form.setData('notes', event.target.value)
                                                    }
                                                    placeholder="Optional delivery or pickup notes"
                                                />
                                                <InputError message={form.errors.notes} />
                                            </div>

                                            <Button
                                                type="button"
                                                className="w-full"
                                                onClick={submit}
                                                disabled={form.processing}
                                            >
                                                Submit Request
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <h2 className="text-lg font-semibold">Request Order</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Sign in to submit an order request to this farmer.
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                                                You can still browse the catalog publicly, but requesting an order requires an account.
                                            </div>

                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <Button asChild className="flex-1">
                                                    <Link href={login()}>Log in</Link>
                                                </Button>

                                                <Button asChild variant="outline" className="flex-1">
                                                    <Link href={register()}>Register</Link>
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
