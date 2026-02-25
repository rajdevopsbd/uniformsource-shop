"use client";

import { useEffect } from 'react';

// Simplified local storage based cart/quote hook
export function useQuoteBuilder() {
    const addToQuote = (productId: string, quantity: number, sizes: string[]) => {
        const existing = localStorage.getItem('us_quote_builder');
        const items = existing ? JSON.parse(existing) : [];
        items.push({ productId, quantity, sizes, id: Math.random().toString(36).substr(2, 9) });
        localStorage.setItem('us_quote_builder', JSON.stringify(items));
        window.dispatchEvent(new Event('quote-updated'));
    };

    return { addToQuote };
}
