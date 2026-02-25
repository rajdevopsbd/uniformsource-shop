"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { Product } from '@/types';

interface ProductGridProps {
    products: Product[];
    categoryFilter?: string;
    moqFilter?: number;
}

export default function ProductGrid({ products, categoryFilter, moqFilter }: ProductGridProps) {
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (categoryFilter && p.category !== categoryFilter) return false;
            if (moqFilter && p.MOQ > moqFilter) return false;
            return true;
        });
    }, [products, categoryFilter, moqFilter]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col bg-surface rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all">
                    <Link href={`/products/${product.id}`} className="block">
                        {/* Image Placeholder/Container */}
                        <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-mono text-xl uppercase tracking-widest italic select-none text-center px-4">
                                {product.name}
                            </div>
                            {/* Real image would go here */}
                            <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10">
                                <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider">{product.category}</span>
                            </div>
                        </div>
                    </Link>

                    <div className="p-6 flex flex-col flex-1">
                        <Link href={`/products/${product.id}`}>
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                        </Link>


                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted uppercase tracking-widest">Fabric</p>
                                <p className="text-xs font-mono text-foreground">{product.fabric}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted uppercase tracking-widest">GSM</p>
                                <p className="text-xs font-mono text-foreground">{product.gsm}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted uppercase tracking-widest">MOQ</p>
                                <p className="text-xs font-mono text-foreground">{product.MOQ} units</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted uppercase tracking-widest">Lead Time</p>
                                <p className="text-xs font-mono text-foreground">{product.leadTimeDays} days</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Estimated</p>
                                <p className="text-lg font-mono font-bold text-accent">${product.basePriceUSD.toFixed(2)}<span className="text-xs text-muted font-normal ml-1">/ unit</span></p>
                            </div>
                            <button
                                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-bold text-foreground hover:bg-zinc-800 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Add to quote logic
                                }}
                            >
                                Add to Quote
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
