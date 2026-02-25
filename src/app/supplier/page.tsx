"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { QuoteRequest } from '@/types';
import { Loader2, Package, Send, ShieldCheck, MapPin } from 'lucide-react';

export default function SupplierPortal() {
    const { user, role, loading: authLoading } = useAuth();
    const [assignedRFQs, setAssignedRFQs] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role?.role === 'supplier' && user) {
            const fetchAssigned = async () => {
                try {
                    const q = query(
                        collection(db, 'quoteRequests'),
                        where('assignedSupplierId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const snapshot = await getDocs(q);
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuoteRequest));
                    setAssignedRFQs(data);
                } catch (error) {
                    console.error("Error fetching assignments:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAssigned();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [role, user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    if (role?.role !== 'supplier') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-2xl font-bold text-foreground mb-2">Access Restriced</h1>
                <p className="text-muted">This portal is only accessible to verified UniformSource suppliers.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2 font-mono uppercase italic tracking-tight">Supplier Portal</h1>
                    <p className="text-muted">Manage your assigned RFQs and submit competitive bids.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl">
                    <ShieldCheck className="text-accent" size={18} />
                    <span className="text-sm font-bold text-accent">Verified Supplier</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <section className="space-y-6">
                    <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-900 pb-2">Assigned Quote Requests</h2>

                    {assignedRFQs.length === 0 ? (
                        <div className="p-16 rounded-3xl bg-zinc-950 border border-zinc-900 text-center space-y-4">
                            <Package className="mx-auto text-zinc-800" size={48} />
                            <p className="text-muted text-sm">No RFQs currently assigned to your account.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {assignedRFQs.map((rfq) => (
                                <div key={rfq.id} className="p-8 bg-surface rounded-2xl border border-zinc-800 hover:border-accent/30 transition-all">
                                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{rfq.industry}</span>
                                            <h3 className="text-2xl font-bold text-foreground">{rfq.companyName}</h3>
                                            <div className="flex items-center gap-2 text-muted text-xs">
                                                <MapPin size={14} />
                                                {rfq.deliveryCountry}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Target Date</p>
                                            <p className="text-sm font-mono text-foreground">{rfq.targetDeliveryDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                                        <div className="flex gap-4">
                                            <div className="px-3 py-1 bg-zinc-900 rounded-lg border border-zinc-800 text-[10px] font-bold uppercase">
                                                {rfq.items.length} Product Types
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 bg-accent text-black font-extrabold rounded-xl hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2">
                                            Submit Quote
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
