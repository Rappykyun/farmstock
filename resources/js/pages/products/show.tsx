import { Head, Link } from '@inertiajs/react';
import { Phone, Store } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { index } from '@/routes/products';

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

export default function ProductBrowseShow({ product }: Props) {
    const [selectedImage, setSelectedImage] = useState(
        product.images.find((image) => image.is_primary)?.url ??
            product.images[0]?.url ??
            null,
    );

    return (
        <>
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

                                    <Button className="w-full" disabled>
                                        Ordering not built yet
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
