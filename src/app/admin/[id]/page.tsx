"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase/config';
import { updateQuoteStatus, saveAdminNotes, logAdminView } from '@/lib/firebase/adminActions';
import { doc, getDoc } from 'firebase/firestore';
import { QuoteRequest, QuoteStatus } from '@/types';
import {
    Loader2, ShieldAlert, ArrowLeft, Building2, User, Mail, Phone,
    Globe, Calendar, DollarSign, Package, FileDown, ClipboardList,
    AlertCircle, Save, Activity, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const STATUSES: QuoteStatus[] = ['new', 'reviewing', 'quoted', 'closed'];

const statusStyles: Record<QuoteStatus, string> = {
    new: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    reviewing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    quoted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    closed: 'bg-zinc-800 text-zinc-500 border-zinc-700',
};

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-zinc-800/60 last:border-0">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} className="text-zinc-400" />
            </div>
            <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{label}</p>
                <p className="text-foreground text-sm font-medium mt-0.5">{value || '—'}</p>
            </div>
        </div>
    );
}

export default function QuoteDetailPage() {
    const { user, role, loading: authLoading } = useAuth();
    const params = useParams();
    const id = params?.id as string;

    const [quote, setQuote] = useState<QuoteRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [status, setStatus] = useState<QuoteStatus>('new');
    const [savingStatus, setSavingStatus] = useState(false);

    const [adminNotes, setAdminNotes] = useState('');
    const [savingNotes, setSavingNotes] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);

    const fetchQuote = useCallback(async () => {
        if (!id) return;
        try {
            const snap = await getDoc(doc(db, 'quoteRequests', id));
            if (!snap.exists()) {
                setError('Quote request not found.');
                return;
            }
            const data = { id: snap.id, ...snap.data() } as QuoteRequest;
            setQuote(data);
            setStatus(data.status);
            setAdminNotes(data.adminNotes ?? '');
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load quote request.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!authLoading && role?.role === 'admin' && id && user) {
            fetchQuote().then(() => {
                // Log view after load
                logAdminView(id, user.uid).catch(() => { });
            });
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [role, authLoading, id, user, fetchQuote]);

    const handleStatusChange = async (newStatus: QuoteStatus) => {
        if (!user || !id) return;
        setSavingStatus(true);
        setError(null);
        try {
            await updateQuoteStatus(id, newStatus, user.uid);
            setStatus(newStatus);
            setQuote(prev => prev ? { ...prev, status: newStatus } : prev);
            // Refresh activity log
            const snap = await getDoc(doc(db, 'quoteRequests', id));
            if (snap.exists()) {
                const data = { id: snap.id, ...snap.data() } as QuoteRequest;
                setQuote(data);
            }
        } catch {
            setError('Failed to update status.');
        } finally {
            setSavingStatus(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!user || !id) return;
        setSavingNotes(true);
        setNotesSaved(false);
        setError(null);
        try {
            await saveAdminNotes(id, adminNotes, user.uid);
            setNotesSaved(true);
            setTimeout(() => setNotesSaved(false), 3000);
            // Refresh activity log
            const snap = await getDoc(doc(db, 'quoteRequests', id));
            if (snap.exists()) {
                const data = { id: snap.id, ...snap.data() } as QuoteRequest;
                setQuote(data);
            }
        } catch {
            setError('Failed to save notes.');
        } finally {
            setSavingNotes(false);
        }
    };

    /* ── Loading ── */
    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={36} />
                <p className="text-muted text-sm font-mono uppercase tracking-widest">Loading RFQ…</p>
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
                    <p className="text-muted text-sm">You do not have administrative privileges.</p>
                </div>
            </div>
        );
    }

    /* ── Error state ── */
    if (error && !quote) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <Link href="/admin" className="inline-flex items-center gap-2 text-muted text-sm hover:text-foreground transition-colors mb-8">
                    <ArrowLeft size={14} /> Back to Console
                </Link>
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!quote) return null;

    const createdDate = quote.createdAt?.seconds
        ? new Date(quote.createdAt.seconds * 1000).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Breadcrumb */}
            <Link href="/admin" className="inline-flex items-center gap-2 text-muted text-sm hover:text-foreground transition-colors mb-8">
                <ArrowLeft size={14} /> Back to Admin Console
            </Link>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
                <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mb-1">Quote Request</p>
                    <h1 className="text-3xl font-black text-foreground font-mono uppercase italic tracking-tight">{quote.companyName}</h1>
                    <p className="text-muted text-sm mt-1 font-mono">ID: {quote.id}</p>
                </div>
                <div className={`self-start px-3 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-widest ${statusStyles[status]}`}>
                    {status}
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Info panels */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Company Info */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 pb-3 mb-2 border-b border-zinc-800">01. Company & Contact</h2>
                        <InfoRow icon={Building2} label="Company Name" value={quote.companyName} />
                        <InfoRow icon={User} label="Contact Name" value={quote.contactName} />
                        <InfoRow icon={Mail} label="Email" value={quote.email} />
                        <InfoRow icon={Phone} label="Phone" value={quote.phone} />
                        <InfoRow icon={ClipboardList} label="Industry" value={quote.industry} />
                    </div>

                    {/* Procurement Details */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 pb-3 mb-2 border-b border-zinc-800">02. Procurement Details</h2>
                        <InfoRow icon={DollarSign} label="Budget Range" value={quote.budgetRange} />
                        <InfoRow icon={Globe} label="Delivery Country" value={quote.deliveryCountry} />
                        <InfoRow icon={Calendar} label="Target Delivery Date" value={quote.targetDeliveryDate} />
                        <InfoRow icon={Clock} label="Submitted At" value={createdDate} />
                    </div>

                    {/* Line Items */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 pb-3 mb-4 border-b border-zinc-800">03. Line Items ({quote.items?.length ?? 0})</h2>
                        {quote.items?.length > 0 ? (
                            <div className="space-y-3">
                                {quote.items.map((item, i) => (
                                    <div key={i} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-2">
                                                <Package size={14} className="text-primary shrink-0" />
                                                <span className="font-bold text-foreground text-sm">{item.productName || item.productId}</span>
                                            </div>
                                            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                        {item.sizes?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {item.sizes.map((s, si) => (
                                                    <span key={si} className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono text-zinc-400 uppercase">{s}</span>
                                                ))}
                                            </div>
                                        )}
                                        {item.customizationNotes && (
                                            <p className="text-xs text-muted font-mono mt-2 pl-1 border-l-2 border-zinc-700">
                                                {item.customizationNotes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted text-sm">No line items recorded.</p>
                        )}
                    </div>

                    {/* Attachments */}
                    {quote.attachments?.length > 0 && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 pb-3 mb-4 border-b border-zinc-800">04. Attachments ({quote.attachments.length})</h2>
                            <div className="space-y-2">
                                {quote.attachments.map((url, i) => {
                                    const filename = decodeURIComponent(url.split('/').pop()?.split('?')[0] ?? `attachment-${i + 1}`);
                                    return (
                                        <a
                                            key={i}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-primary/40 transition-all group"
                                        >
                                            <FileDown size={14} className="text-zinc-500 group-hover:text-primary transition-colors shrink-0" />
                                            <span className="text-sm text-foreground font-mono truncate">{filename}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Admin controls + Activity log */}
                <div className="space-y-6">
                    {/* Admin Controls */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-6">
                        <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 pb-3 mb-4 border-b border-zinc-800">Admin Controls</h2>

                        {/* Status */}
                        <div className="mb-6">
                            <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-widest">Quote Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value as QuoteStatus)}
                                disabled={savingStatus}
                                className={`w-full px-3 py-2.5 bg-zinc-950 border rounded-xl text-sm font-mono appearance-none outline-none focus:border-primary transition-all cursor-pointer disabled:opacity-50 ${statusStyles[status]}`}
                                aria-label="Quote Status"
                            >
                                {STATUSES.map(s => (
                                    <option key={s} value={s} className="bg-zinc-900 text-foreground normal-case tracking-normal">
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {savingStatus && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted font-mono">
                                    <Loader2 size={10} className="animate-spin" /> Saving…
                                </div>
                            )}
                        </div>

                        {/* Admin Notes */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-widest">
                                Internal Notes <span className="text-zinc-600">(not visible to buyer)</span>
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={6}
                                placeholder="Add internal notes, supplier matches, pricing references, follow-up reminders…"
                                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-foreground outline-none focus:border-primary transition-all resize-none placeholder:text-zinc-600"
                            />
                            <button
                                onClick={handleSaveNotes}
                                disabled={savingNotes}
                                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-black font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                {savingNotes ? (
                                    <><Loader2 size={14} className="animate-spin" /> Saving…</>
                                ) : notesSaved ? (
                                    <><Save size={14} /> Notes Saved ✓</>
                                ) : (
                                    <><Save size={14} /> Save Notes</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-800">
                            <Activity size={14} className="text-zinc-500" />
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Activity Log</h2>
                        </div>
                        {quote.activityLog && quote.activityLog.length > 0 ? (
                            <div className="relative space-y-0">
                                {[...quote.activityLog].reverse().map((entry, i) => (
                                    <div key={i} className="flex gap-3 pb-4 last:pb-0">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                            {i < quote.activityLog!.length - 1 && (
                                                <div className="w-px flex-1 bg-zinc-800 mt-1" />
                                            )}
                                        </div>
                                        <div className="pb-2">
                                            <p className="text-xs text-foreground font-medium">{entry.action}</p>
                                            <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                                                {typeof entry.timestamp === 'string'
                                                    ? new Date(entry.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted text-xs font-mono">No activity logged yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
