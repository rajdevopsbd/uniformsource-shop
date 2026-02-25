import { useState, useEffect } from 'react';
import { QuoteRequestItem } from '@/types';

const STORAGE_KEY = 'uniformsource_quote_draft';

export function useQuoteStore() {
    const [items, setItems] = useState<QuoteRequestItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse quote draft", e);
            }
        }
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item: QuoteRequestItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === item.productId);
            if (existing) {
                return prev.map(i => i.productId === item.productId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                );
            }
            return [...prev, item];
        });
    };

    const removeItem = (productId: string) => {
        setItems(prev => prev.filter(i => i.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
    };

    const clearQuote = () => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        itemCount: items.length
    };
}
