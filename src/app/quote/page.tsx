"use client";

import QuoteForm from '@/components/quote/QuoteForm';
import QuoteItemList from '@/components/quote/QuoteItemList';

export default function QuotePage() {
    return (
        <div className="bg-zinc-950 min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                    {/* Left: Item List (Builder) */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <QuoteItemList />
                    </div>

                    {/* Right: Submission Form */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <QuoteForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
