"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase/config';
import { updateQuoteStatus } from '@/lib/firebase/adminActions';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { QuoteRequest, QuoteStatus } from '@/types';
import { Loader2, ClipboardList, AlertCircle, ChevronRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const STATUSES: QuoteStatus[] = ['new', 'reviewing', 'quoted', 'closed'];

const statusStyles: Record<QuoteStatus, string> = {
    new: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    reviewing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    quoted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    closed: 'bg-zinc-800 text-zinc-500 border-zinc-700',
};

export default function AdminDashboard() {
    const { user, role, loading: authLoading } = useAuth();
    const [requests, setRequests] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as QuoteRequest));
            setRequests(data);
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load quote requests. Check your connection and permissions.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && role?.role === 'admin') {
            fetchRequests();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [role, authLoading, fetchRequests]);

    const handleStatusChange = async (id: string, status: QuoteStatus) => {
        if (!user) return;
        setUpdatingId(id);
        try {
            await updateQuoteStatus(id, status, user.uid);
            setRequests(prev =>
                prev.map(r => r.id === id ? { ...r, status } : r)
            );
        } catch {
            setError('Failed to update status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    /* ── Loading state ── */
    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={36} />
                <p className="text-muted text-sm font-mono uppercase tracking-widest">Loading Console…</p>
            </div>
        );
    }

    /* ── Access denied ── */
    if (role?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                    <ShieldAlert className="text-red-500" size={36} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
                    <p className="text-muted text-sm max-w-sm">You do not have administrative privileges to access this dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mb-1">UniformSource</p>
                    <h1 className="text-3xl font-black text-foreground font-mono uppercase italic tracking-tight">Admin Console</h1>
                    <p className="text-muted text-sm mt-1">Operational oversight of all incoming RFQs.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-foreground">
                        <span className="text-zinc-500">Total: </span>{requests.length} RFQs
                    </div>
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm font-mono text-amber-400">
                        <span className="text-zinc-500">New: </span>{requests.filter(r => r.status === 'new').length}
                    </div>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
                            <ClipboardList className="text-zinc-600" size={28} />
                        </div>
                        <div className="text-center">
                            <p className="text-foreground font-bold mb-1">No quote requests yet</p>
                            <p className="text-muted text-sm">New RFQs will appear here once buyers submit them.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-800 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                    <th className="text-left px-6 py-4">Company</th>
                                    <th className="text-left px-4 py-4">Industry</th>
                                    <th className="text-left px-4 py-4">Budget</th>
                                    <th className="text-left px-4 py-4">Delivery Date</th>
                                    <th className="text-left px-4 py-4">Status</th>
                                    <th className="text-left px-4 py-4">Created</th>
                                    <th className="text-left px-4 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors group">
                                        {/* Company */}
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground">{req.companyName}</div>
                                            <div className="text-xs text-muted font-mono">{req.contactName}</div>
                                        </td>
                                        {/* Industry */}
                                        <td className="px-4 py-4 text-muted capitalize text-xs font-mono">{req.industry}</td>
                                        {/* Budget */}
                                        <td className="px-4 py-4 text-muted text-xs font-mono">{req.budgetRange}</td>
                                        {/* Delivery Date */}
                                        <td className="px-4 py-4 text-muted text-xs font-mono">{req.targetDeliveryDate || '—'}</td>
                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                {updatingId === req.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 size={12} className="animate-spin text-primary" />
                                                        <span className="text-xs text-muted font-mono">Saving…</span>
                                                    </div>
                                                ) : (
                                                    <select
                                                        value={req.status}
                                                        onChange={(e) => handleStatusChange(req.id, e.target.value as QuoteStatus)}
                                                        className={`px-2 py-1 rounded border text-[10px] font-mono uppercase tracking-widest appearance-none cursor-pointer bg-transparent focus:outline-none ${statusStyles[req.status]}`}
                                                        aria-label={`Status for ${req.companyName}`}
                                                    >
                                                        {STATUSES.map(s => (
                                                            <option key={s} value={s} className="bg-zinc-900 text-foreground normal-case tracking-normal text-xs">
                                                                {s}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                        {/* Created At */}
                                        <td className="px-4 py-4 text-muted text-xs font-mono">
                                            {req.createdAt?.seconds
                                                ? new Date(req.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
                                                : '—'}
                                        </td>
                                        {/* Action */}
                                        <td className="px-4 py-4">
                                            <Link
                                                href={`/admin/${req.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg text-xs font-bold text-foreground transition-all group-hover:border-primary/40"
                                            >
                                                View
                                                <ChevronRight size={12} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
