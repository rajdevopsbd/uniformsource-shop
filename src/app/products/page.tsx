"use client";

import { useState } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { Product, Category } from '@/types';
import { Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';

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

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const categories: Category[] = ['school', 'corporate', 'hospitality', 'sports'];

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="max-w-xl">
                    <h1 className="text-4xl font-bold text-foreground mb-4 font-mono uppercase italic tracking-tight">Product Catalog</h1>
                    <p className="text-muted leading-relaxed">
                        Browse our curated selection of factory-direct uniform products.
                        Add items to your quote builder to receive custom pricing from verified suppliers.
                    </p>
                </div>

                {/* Desktop Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === null
                                ? 'bg-primary text-black'
                                : 'bg-zinc-900 text-muted hover:text-foreground border border-zinc-800'
                            }`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${activeCategory === cat
                                    ? 'bg-primary text-black'
                                    : 'bg-zinc-900 text-muted hover:text-foreground border border-zinc-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-12">
                {/* Sidebar Filter - Desktop */}
                <aside className="w-64 hidden lg:block space-y-8">
                    <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Refine Search</h4>
                        <div className="space-y-4">
                            <div className="px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors">
                                <span className="text-sm">Price Range</span>
                                <ChevronDown size={16} />
                            </div>
                            <div className="px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors">
                                <span className="text-sm">Minimum Order</span>
                                <ChevronDown size={16} />
                            </div>
                            <div className="px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors">
                                <span className="text-sm">Lead Time</span>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                        <h4 className="text-sm font-bold text-primary mb-2">Need something custom?</h4>
                        <p className="text-xs text-muted mb-4">Our design team can help you create a unique uniform line from scratch.</p>
                        <button className="text-xs font-bold text-foreground border-b border-primary pb-1 hover:text-primary transition-colors">Speak with an export</button>
                    </div>
                </aside>

                {/* Results */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
                        <span className="text-sm text-muted font-mono">Showing {MOCK_PRODUCTS.filter(p => !activeCategory || p.category === activeCategory).length} products</span>
                        <button className="flex items-center gap-2 lg:hidden text-sm text-muted outline-none">
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>
                    <ProductGrid
                        products={MOCK_PRODUCTS}
                        categoryFilter={activeCategory || undefined}
                    />
                </div>
            </div>
        </div>
    );
}
