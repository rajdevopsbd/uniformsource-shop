"use client";

import { useQuoteBuilder } from '@/hooks/useQuoteBuilder';
import { Product } from '@/types';
import { Check, Info, Truck, ShieldCheck, Factory } from 'lucide-react';

export default function ProductDetail({ product }: { product: Product }) {
    const { addToQuote } = useQuoteBuilder();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left: Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
                        <span className="text-zinc-800 font-mono text-4xl uppercase tracking-[0.2em] italic select-none">
                            {product.name}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer hover:border-primary transition-colors"></div>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">{product.category}</span>
                        <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
                        <p className="text-lg text-muted leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-zinc-800 mb-8">
                        <div>
                            <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Estimated Base Price</p>
                            <p className="text-3xl font-mono font-bold text-accent">${product.basePriceUSD.toFixed(2)}<span className="text-sm text-muted font-normal ml-2">/ unit</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Minimum Order Qty</p>
                            <p className="text-3xl font-mono font-bold text-foreground">{product.MOQ}<span className="text-sm text-muted font-normal ml-2">units</span></p>
                        </div>
                    </div>

                    {/* Specs Table */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 font-mono">Technical Specifications</h3>
                        <div className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden">
                            <div className="grid grid-cols-2 border-b border-zinc-900">
                                <div className="px-4 py-3 text-xs font-mono text-muted uppercase bg-zinc-900/50">Fabric composition</div>
                                <div className="px-4 py-3 text-sm font-mono text-foreground">{product.fabric}</div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-zinc-900">
                                <div className="px-4 py-3 text-xs font-mono text-muted uppercase bg-zinc-900/50">Weight (GSM)</div>
                                <div className="px-4 py-3 text-sm font-mono text-foreground">{product.gsm} gsm</div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-zinc-900">
                                <div className="px-4 py-3 text-xs font-mono text-muted uppercase bg-zinc-900/50">Production Lead Time</div>
                                <div className="px-4 py-3 text-sm font-mono text-foreground">{product.leadTimeDays} days</div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="px-4 py-3 text-xs font-mono text-muted uppercase bg-zinc-900/50">Certifications</div>
                                <div className="px-4 py-3 text-sm font-mono text-foreground">{product.certifications.join(', ')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <button
                            onClick={() => addToQuote(product.id, product.MOQ, ['M', 'L', 'XL'])}
                            className="w-full py-4 bg-primary text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-3"
                        >
                            Add to Quote Builder
                            <Check size={20} />
                        </button>
                        <p className="text-[10px] text-center text-muted uppercase tracking-[0.2em]">Note: This does not initialize an order. Final pricing may vary based on customization.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
