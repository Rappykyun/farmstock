import { Head, Link } from '@inertiajs/react';
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
    return (
        <>
            <Head title={product.name} />

            <div className="space-y-4 p-4">
                <Link
                    href={index.url()}
                    className="text-sm text-muted-foreground underline"
                >
                    Back to products
                </Link>

                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">{product.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        PHP {product.price}
                    </p>
                </div>
            </div>
        </>
    );
}
