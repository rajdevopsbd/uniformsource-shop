"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { QuoteRequest } from '@/types';
import { Loader2, ClipboardList, User, Clock, CheckCircle, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
    const { role, loading: authLoading } = useAuth();
    const [requests, setRequests] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role?.role === 'admin') {
            const fetchRequests = async () => {
                try {
                    const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
                    const snapshot = await getDocs(q);
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuoteRequest));
                    setRequests(data);
                } catch (error) {
                    console.error("Error fetching requests:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRequests();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [role, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (role?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
                <p className="text-muted">You do not have administrative privileges to access this dashboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2 font-mono uppercase italic tracking-tight">Admin Console</h1>
                    <p className="text-muted">Global oversight of all active Request for Quotations (RFQs).</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-bold text-foreground">
                        Total RFQs: {requests.length}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {requests.length === 0 ? (
                    <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center">
                        <p className="text-muted">No active quote requests found in the system.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="group p-6 bg-surface rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest ${req.status === 'new' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                            req.status === 'assigned' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                                                'bg-zinc-800 text-muted border border-zinc-700'
                                        }`}>
                                        {req.status}
                                    </span>
                                    <h3 className="text-lg font-bold text-foreground">{req.companyName}</h3>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div className="flex items-center gap-2 text-muted">
                                        <User size={14} />
                                        {req.contactName}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted text-wrap">
                                        <Clock size={14} />
                                        {new Date(req.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted">
                                        <ClipboardList size={14} />
                                        {req.items.length} Items
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-foreground hover:bg-zinc-800 transition-colors flex items-center gap-2">
                                    Assign Supplier
                                    <ExternalLink size={14} />
                                </button>
                                <button className="px-4 py-2 bg-primary text-black rounded-lg text-xs font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
