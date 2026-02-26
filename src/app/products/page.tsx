"use client";

import { useState } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { Category, Product } from '@/types';
import { SlidersHorizontal } from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [moqLimit, setMoqLimit] = useState<number | null>(null);
    const [leadTimeLimit, setLeadTimeLimit] = useState<number | null>(null);

    const productsRef = collection(db, 'products');
    const productsQuery = query(
        productsRef,
        where('active', '==', true),
        ...(activeCategory ? [where('category', '==', activeCategory)] : [])
    );

    const [values, loading, error] = useCollection(productsQuery);

    const products = values?.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[] || [];

    // Client-side filtering for MOQ and Lead Time if needed, or we could add more Firestore queries.
    // Given B2B complexity, client-side refinement is often better for UX.
    const filteredProducts = products.filter(p => {
        if (moqLimit && p.MOQ > moqLimit) return false;
        if (leadTimeLimit && p.leadTimeDays > leadTimeLimit) return false;
        return true;
    });

    const categories: Category[] = ['school', 'corporate', 'hospitality', 'sports'];

    if (error) {
        return <div className="max-w-7xl mx-auto px-4 py-20 text-red-500">Error loading products: {error.message}</div>;
    }

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
                            <div className="space-y-2">
                                <label className="text-[10px] text-muted uppercase tracking-widest px-1">Max MOQ</label>
                                <select
                                    className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-sm outline-none focus:border-primary transition-colors appearance-none"
                                    onChange={(e) => setMoqLimit(e.target.value ? parseInt(e.target.value) : null)}
                                    aria-label="Filter by Maximum MOQ"
                                >
                                    <option value="">Any MOQ</option>
                                    <option value="100">Up to 100</option>
                                    <option value="500">Up to 500</option>
                                    <option value="1000">Up to 1000</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-muted uppercase tracking-widest px-1">Max Lead Time (Days)</label>
                                <select
                                    className="w-full px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-sm outline-none focus:border-primary transition-colors appearance-none"
                                    onChange={(e) => setLeadTimeLimit(e.target.value ? parseInt(e.target.value) : null)}
                                    aria-label="Filter by Maximum Lead Time"
                                >
                                    <option value="">Any Time</option>
                                    <option value="15">Up to 15 days</option>
                                    <option value="30">Up to 30 days</option>
                                    <option value="60">Up to 60 days</option>
                                </select>
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
                        <span className="text-sm text-muted font-mono">
                            {loading ? 'Searching factories...' : `Showing ${filteredProducts.length} products`}
                        </span>
                        <button className="flex items-center gap-2 lg:hidden text-sm text-muted outline-none">
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-[4/5] bg-zinc-900 animate-pulse rounded-xl border border-zinc-800" />
                            ))}
                        </div>
                    ) : (
                        <ProductGrid
                            products={filteredProducts}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
