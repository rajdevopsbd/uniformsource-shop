import ProductDetail from '@/components/products/ProductDetail';
import { Product } from '@/types';

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'oxford-shirt-elite',
        name: 'Elite Oxford Classic Shirt',
        category: 'school',
        description: 'A premium, wrinkle-resistant Oxford cotton shirt. Features reinforced dual-stitching and a tailored fit for long-term comfort and durability in active school environments.',
        fabric: '60% Giza Cotton, 40% High-Performance Polyester',
        gsm: 145,
        MOQ: 500,
        basePriceUSD: 6.80,
        leadTimeDays: 45,
        imageUrls: ['https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800'],
        certifications: ['OEKO-TEX Standard 100', 'BSCI Compliant'],
        active: true
    },
    {
        id: 'executive-blazer-zinc',
        name: 'Zinc-Series Tailored Blazer',
        category: 'corporate',
        description: 'Professional Italian-inspired cut with stain-resistant wool-blend fabric. Includes internal tech-pockets and premium lining for a sophisticated office presence.',
        fabric: '70% Australian Merino Wool, 30% Polyester',
        gsm: 280,
        MOQ: 100,
        basePriceUSD: 48.50,
        leadTimeDays: 60,
        imageUrls: ['https://images.unsplash.com/photo-1594932224440-75677aefea81?auto=format&fit=crop&q=80&w=800'],
        certifications: ['ISO 9001:2015', 'Woolmark Certified'],
        active: true
    },
    {
        id: 'safety-polo-industrial',
        name: 'Industrial Pro Dry-Fit Polo',
        category: 'corporate',
        description: 'High-visibility safety polo with moisture-wicking technology. Designed for logistics and engineering teams operating in demanding environments.',
        fabric: 'Micro-Fine Birdseye Polyester',
        gsm: 185,
        MOQ: 300,
        basePriceUSD: 11.20,
        leadTimeDays: 30,
        imageUrls: ['https://images.unsplash.com/photo-1586363104812-3a4e6fa6ba89?auto=format&fit=crop&q=80&w=800'],
        certifications: ['ANSI/ISEA 107-2020', 'UPF 50+'],
        active: true
    },
    {
        id: 'elite-performance-jersey',
        name: 'Elite Core Team Jersey',
        category: 'sports',
        description: 'Sublimated performance jersey with 4-way stretch and anti-microbial treatment. Engineered for elite athletic competition and breathability.',
        fabric: '85% Recycled Polyester, 15% Spandex',
        gsm: 155,
        MOQ: 50,
        basePriceUSD: 16.00,
        leadTimeDays: 25,
        imageUrls: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800'],
        certifications: ['Fair Trade Certified', 'Global Recycled Standard'],
        active: true
    },
    {
        id: 'artisan-canvas-apron',
        name: 'Artisan Series Waxed Apron',
        category: 'hospitality',
        description: 'Heavy-duty 12oz waxed canvas with hand-crafted leather detailing. Perfect for premium baristas, chefs, and service professionals.',
        fabric: '100% Cotton Waxed Canvas',
        gsm: 340,
        MOQ: 200,
        basePriceUSD: 22.00,
        leadTimeDays: 40,
        imageUrls: ['https://images.unsplash.com/photo-1594498653385-d5172b532c00?auto=format&fit=crop&q=80&w=800'],
        certifications: ['Organic Content Standard'],
        active: true
    },
    {
        id: 'tech-comfort-trousers',
        name: 'Tech-Comfort Daily Trousers',
        category: 'school',
        description: 'Stain-resistant and easy-iron school trousers with an adjustable waistband and reinforced knees for maximum longevity.',
        fabric: '65% Recycled Polyester, 35% Viscose',
        gsm: 245,
        MOQ: 400,
        basePriceUSD: 12.50,
        leadTimeDays: 50,
        imageUrls: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'],
        certifications: ['OEKO-TEX Standard 100'],
        active: true
    }
];

export async function generateStaticParams() {
    return MOCK_PRODUCTS.map((product) => ({
        id: product.id,
    }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = MOCK_PRODUCTS.find(p => p.id === id);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-32">
                <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
                <p className="text-muted">The product you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    return <ProductDetail product={product} />;
}


