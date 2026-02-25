"use client";

import { useEffect, useState } from 'react';
import { useQuoteStore } from '@/hooks/useQuoteStore';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Trash2, Plus, Minus, Package } from 'lucide-react';
import Image from 'next/image';

export default function QuoteItemList() {
    const { items, removeItem, updateQuantity } = useQuoteStore();
    const [productDetails, setProductDetails] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchDetails = async () => {
            const details: Record<string, any> = { ...productDetails };
            for (const item of items) {
                if (!details[item.productId]) {
                    const docRef = doc(db, 'products', item.productId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        details[item.productId] = docSnap.data();
                    }
                }
            }
            setProductDetails(details);
        };

        if (items.length > 0) {
            fetchDetails();
        }
    }, [items]);

    if (items.length === 0) {
        return (
            <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl bg-zinc-950/20">
                <Package className="mx-auto text-zinc-800 mb-4" size={48} />
                <h3 className="text-xl font-bold text-zinc-500 font-mono uppercase tracking-widest">Your Quote Draft is Empty</h3>
                <p className="text-zinc-600 mt-2">Browse the catalog to add products for quotation.</p>
                <button
                    onClick={() => window.location.href = '/products'}
                    className="mt-6 px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-bold hover:bg-zinc-800 transition-colors"
                >
                    Browse Catalog
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-zinc-900 pb-2">Customised Draft Selection</h3>
            <div className="space-y-4">
                {items.map((item) => {
                    const product = productDetails[item.productId];
                    return (
                        <div key={item.productId} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6 hover:border-zinc-700 transition-all">
                            <div className="relative w-full md:w-24 aspect-square bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0">
                                {product?.imageUrls?.[0] ? (
                                    <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-zinc-800 font-mono uppercase text-center p-2">
                                        {product?.name || 'Loading...'}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h4 className="text-lg font-bold text-foreground font-mono uppercase italic leading-tight">
                                            {product?.name || 'Loading Factory Data...'}
                                        </h4>
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted font-mono uppercase tracking-widest mb-4">
                                        Category: <span className="text-zinc-400">{product?.category || '---'}</span>
                                    </p>
                                    {item.customizationNotes && (
                                        <div className="text-[10px] font-mono text-primary bg-primary/5 border border-primary/10 rounded-lg p-3 mb-4">
                                            <span className="uppercase font-black block mb-1">Customisation Specs:</span>
                                            <span className="text-zinc-400">{item.customizationNotes}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-4 md:mt-0">
                                    <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 p-1">
                                        <button
                                            onClick={() => updateQuantity(item.productId, Math.max((product?.MOQ || 1), item.quantity - 10))}
                                            className="p-2 text-zinc-500 hover:text-foreground transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-16 text-center font-mono text-sm text-foreground">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 10)}
                                            className="p-2 text-zinc-500 hover:text-foreground transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5 font-mono">Est. Value</p>
                                        <p className="text-lg font-mono font-bold text-accent">
                                            {product?.basePriceUSD ? `$${(product.basePriceUSD * item.quantity).toLocaleString()}` : 'TBD'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Total Items</span>
                    <span className="text-lg font-mono font-bold text-foreground">{items.length}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary font-black">Consolidated Estimate</span>
                    <span className="text-2xl font-mono font-bold text-primary">
                        ${items.reduce((acc, item) => {
                            const product = productDetails[item.productId];
                            return acc + (product?.basePriceUSD || 0) * item.quantity;
                        }, 0).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
