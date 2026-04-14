import { Head, Link } from '@inertiajs/react';
import { show } from '@/routes/products';


type ProductRow = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    current_stock: string;
    category: string | null;
    unit: string | null;
    farmer_name: string | null;
    image: string | null;
};

type CategoryOption = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    filters: {
        search: string;
        category: string;
        sort: string;
    };
    categories: CategoryOption[];
    products: {
        data: ProductRow[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
};

export default function ProductBrowseIndex({ products }: Props) {
    return (
        <>
            <Head title="Products" />

            <div className="space-y-4 p-4">
                <div className="rounded-xl border p-4">
                    <h1 className="text-lg font-semibold">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Placeholder browse page for the backend browsing step.
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm font-medium">
                        Visible products: {products.data.length}
                    </p>
                </div>

                <div className="space-y-2 rounded-xl border p-4">
                    {products.data.map((product) => (
                        <Link
                            key={product.id}
                            href={show.url(product.id)}
                            className="block rounded-lg border p-3"
                        >
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                                PHP {product.price}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
