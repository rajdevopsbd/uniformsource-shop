"use client";

import { useState } from 'react';
import { useQuoteStore } from '@/hooks/useQuoteStore';
import { Product } from '@/types';
import { Check, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetail({ product }: { product: Product }) {
    const { addItem } = useQuoteStore();
    const [quantity, setQuantity] = useState(product.MOQ);
    const [notes, setNotes] = useState('');
    const [added, setAdded] = useState(false);

    const handleAddToQuote = () => {
        addItem({
            productId: product.id,
            quantity: quantity,
            sizes: [], // Sizes can be handled separately if needed
            customizationNotes: notes
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left: Images */}
                <div className="space-y-6">
                    <div className="aspect-square bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
                        {product.imageUrls && product.imageUrls[0] ? (
                            <Image
                                src={product.imageUrls[0]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <span className="text-zinc-800 font-mono text-4xl uppercase tracking-[0.2em] italic select-none text-center px-4">
                                {product.name}
                            </span>
                        )}

                        <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10">
                            <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">{product.category}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <h1 className="text-5xl font-black text-foreground mb-6 font-mono uppercase italic tracking-tighter leading-none">{product.name}</h1>
                        <p className="text-xl text-muted leading-relaxed max-w-xl">
                            {product.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-10 border-y border-zinc-800 mb-10">
                        <div>
                            <p className="text-[10px] text-muted uppercase tracking-[0.3em] mb-2 font-mono">Factory MOQ</p>
                            <p className="text-4xl font-mono font-bold text-foreground">{product.MOQ}<span className="text-sm text-muted font-normal ml-2">units</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted uppercase tracking-[0.3em] mb-2 font-mono">Sample Unit Price</p>
                            <p className="text-4xl font-mono font-bold text-accent">
                                {product.basePriceUSD ? `$${product.basePriceUSD.toFixed(2)}` : 'N/A'}
                                <span className="text-sm text-muted font-normal ml-2">/ unit</span>
                            </p>
                        </div>
                    </div>

                    {/* Specs Table */}
                    <div className="mb-10">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-6 font-mono font-black">Technical Specs / JetBrains Mono</h3>
                        <div className="bg-zinc-950/50 rounded-2xl border border-zinc-800 overflow-hidden">
                            {[
                                { label: 'Fabric', value: product.fabric },
                                { label: 'Weight', value: `${product.gsm} GSM` },
                                { label: 'MOQ', value: `${product.MOQ} Units` },
                                { label: 'Lead Time', value: `${product.leadTimeDays} Days` },
                                { label: 'Certifications', value: product.certifications.join(', ') }
                            ].map((spec, i) => (
                                <div key={i} className={`grid grid-cols-3 border-zinc-900 ${i !== 4 ? 'border-b' : ''}`}>
                                    <div className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase bg-zinc-900/30 flex items-center">
                                        {spec.label}
                                    </div>
                                    <div className="col-span-2 px-6 py-4 text-sm font-mono text-foreground font-medium flex items-center">
                                        {spec.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Builder Controls */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] text-muted uppercase tracking-widest px-1 font-mono">Target Quantity</label>
                                <input
                                    type="number"
                                    min={product.MOQ}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(product.MOQ, parseInt(e.target.value) || 0))}
                                    className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-foreground focus:border-primary outline-none transition-all"
                                    aria-label="Enter target quantity"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-muted uppercase tracking-widest px-1 font-mono">Customization Notes (Colours, Branding, Fit)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Include embroidered school crest on left chest. Navy blue fabric (Pantone 19-4029)..."
                                className="w-full h-32 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-sm text-foreground focus:border-primary outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleAddToQuote}
                                disabled={added}
                                className={`w-full py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${added
                                    ? 'bg-zinc-800 text-primary border border-primary/20 cursor-default'
                                    : 'bg-primary text-black hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:-translate-y-1'
                                    }`}
                            >
                                {added ? (
                                    <>
                                        Added to Quote Builder
                                        <Check size={20} strokeWidth={3} />
                                    </>
                                ) : (
                                    <>
                                        Add to Quote Builder
                                        <ArrowRight size={20} strokeWidth={3} />
                                    </>
                                )}
                            </button>
                            <p className="mt-4 text-[10px] text-center text-zinc-500 font-mono uppercase tracking-widest leading-relaxed">
                                Quote drafts persist in your session. Final MOQ and pricing confirmed upon factory review.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
