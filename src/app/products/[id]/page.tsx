"use client";

import { useParams } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';
import { Product } from '@/types';

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Classic Oxford School Shirt',
        category: 'school',
        description: 'Durable, breathable Oxford cotton shirt designed for daily school wear.',
        fabric: '60% Cotton, 40% Polyester',
        gsm: 135,
        MOQ: 500,
        basePriceUSD: 5.50,
        leadTimeDays: 45,
        imageUrls: [],
        certifications: ['OEKO-TEX'],
        active: true
    },
    {
        id: '2',
        name: 'Executive Slim-Fit Blazer',
        category: 'corporate',
        description: 'Premium wool-blend blazer with reinforced stitching and tailored fit.',
        fabric: 'Wool / Poly Blend',
        gsm: 280,
        MOQ: 100,
        basePriceUSD: 42.00,
        leadTimeDays: 60,
        imageUrls: [],
        certifications: ['ISO 9001'],
        active: true
    },
    {
        id: '3',
        name: 'Industrial Safety Polo',
        category: 'corporate',
        description: 'High-visibility moisture-wicking polo for logistics and site staff.',
        fabric: 'Moisture-wicking Polyester',
        gsm: 180,
        MOQ: 300,
        basePriceUSD: 8.75,
        leadTimeDays: 30,
        imageUrls: [],
        certifications: ['ANSI Class 2'],
        active: true
    },
    {
        id: '4',
        name: 'Breathable Sports Jersey',
        category: 'sports',
        description: 'Advanced dry-fit mesh jersey for competitive team sports.',
        fabric: '100% Recycled Polyester',
        gsm: 140,
        MOQ: 50,
        basePriceUSD: 12.50,
        leadTimeDays: 25,
        imageUrls: [],
        certifications: ['Fair Trade'],
        active: true
    },
    {
        id: '5',
        name: 'Hospitality Service Apron',
        category: 'hospitality',
        description: 'Heavy-duty canvas apron with reinforced leather straps and pockets.',
        fabric: 'Cotton Canvas',
        gsm: 320,
        MOQ: 200,
        basePriceUSD: 15.00,
        leadTimeDays: 40,
        imageUrls: [],
        certifications: ['OEKO-TEX'],
        active: true
    },
    {
        id: '6',
        name: 'Senior School Trousers',
        category: 'school',
        description: 'Teflon-coated stain-resistant trousers with adjustable waist.',
        fabric: '65% Polyester, 35% Viscose',
        gsm: 240,
        MOQ: 400,
        basePriceUSD: 9.80,
        leadTimeDays: 50,
        imageUrls: [],
        certifications: ['OEKO-TEX'],
        active: true
    }
];

export default function ProductDetailPage() {
    const params = useParams();
    const product = MOCK_PRODUCTS.find(p => p.id === params.id);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-vh-100 py-32">
                <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
                <p className="text-muted">The product you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    return <ProductDetail product={product} />;
}
