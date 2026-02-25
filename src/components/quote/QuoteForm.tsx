"use client";

import { useState, useRef } from 'react';
import { Send, FileUp, Calendar, Globe, Building2, UserCircle, Mail, Phone, Info, Briefcase, DollarSign, X, ArrowRight } from 'lucide-react';
import { useQuoteStore } from '@/hooks/useQuoteStore';
import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function QuoteSubmissionForm() {
    const { items, clearQuote } = useQuoteStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        industry: '',
        deliveryCountry: '',
        targetDeliveryDate: '',
        budgetRange: '',
        additionalNotes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert("Please add at least one product to your quote draft.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload attachments
            const attachmentUrls = [];
            for (const file of files) {
                const storageRef = ref(storage, `quotes/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                attachmentUrls.push(url);
            }

            // 2. Save quote request to Firestore
            await addDoc(collection(db, 'quoteRequests'), {
                ...formData,
                items: items,
                attachments: attachmentUrls,
                status: 'new',
                createdAt: serverTimestamp(),
                companyId: null // Support anonymous for now
            });

            setIsSubmitting(false);
            setSuccess(true);
            clearQuote();
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit quote request. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Send className="text-primary w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black text-foreground mb-6 font-mono uppercase italic tracking-tighter">Request Transmitted</h2>
                <p className="text-muted text-lg mb-10 leading-relaxed font-mono">
                    System Protocol: RFQ RECEIVED. Our procurement agents will verify factory capacity and assign your request to vetted suppliers.
                    Confirmation dispatched to {formData.email}.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-10 py-4 bg-zinc-900 border border-zinc-800 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                    Return to Dispatch
                </button>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="mb-12">
                <h2 className="text-3xl font-black text-foreground mb-4 font-mono uppercase italic tracking-tighter">Submit Formal RFQ</h2>
                <p className="text-muted text-sm leading-relaxed max-w-xl font-mono uppercase tracking-wider opacity-60">
                    Industrial Procurement Protocol v4.0. Complete the grid below to initiate factory negotiation.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Company Info */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-zinc-800 pb-3 italic">01. Organization Matrix</h3>

                        <div className="space-y-4">
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Company / School / Org Name"
                                    required
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <select
                                    name="industry"
                                    required
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm appearance-none"
                                    aria-label="Select Industry"
                                >
                                    <option value="" disabled>Select Industry Type</option>
                                    <option value="education">Education / School</option>
                                    <option value="corporate">Corporate / Office</option>
                                    <option value="hospitality">Hospitality / F&B</option>
                                    <option value="healthcare">Healthcare / Medical</option>
                                    <option value="logistics">Logistics / Industrial</option>
                                    <option value="sports">Sports / Athletics</option>
                                </select>
                            </div>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="deliveryCountry"
                                    placeholder="Final Delivery Country"
                                    required
                                    value={formData.deliveryCountry}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-zinc-800 pb-3 italic">02. Lead Contact</h3>
                        <div className="space-y-4">
                            <div className="relative group">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="contactName"
                                    placeholder="Authorised Personnel Name"
                                    required
                                    value={formData.contactName}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Work Email Address"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Direct Contact Number"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-zinc-800 pb-3 italic">03. Project Timeline</h3>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="date"
                                name="targetDeliveryDate"
                                required
                                value={formData.targetDeliveryDate}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm"
                                aria-label="Target Delivery Date"
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-zinc-800 pb-3 italic">04. Estimated Budget (USD)</h3>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                            <select
                                name="budgetRange"
                                required
                                value={formData.budgetRange}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm appearance-none"
                                aria-label="Select Budget Range"
                            >
                                <option value="" disabled>Select Budget Range</option>
                                <option value="<5k">Under $5,000</option>
                                <option value="5k-20k">$5,000 - $20,000</option>
                                <option value="20k-100k">$20,000 - $100,000</option>
                                <option value="100k+">$100,000+</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requirements */}
                <section className="space-y-6">
                    <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-zinc-800 pb-3 italic">05. Technical Requirements & Attachments</h3>
                    <div className="space-y-6">
                        <textarea
                            name="additionalNotes"
                            rows={4}
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            placeholder="Provide details on sizing breakdown, specific Pantone colours, fabric weight requirements, or custom branding positions..."
                            className="w-full p-6 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:border-primary transition-all text-foreground font-mono text-sm resize-none"
                        ></textarea>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="p-10 border-2 border-dashed border-zinc-800 rounded-3xl hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer bg-zinc-950/40 group hover:bg-zinc-900/60"
                        >
                            <input
                                type="file"
                                multiple
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.ai,.png,.jpg,.jpeg"
                            />
                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:rotate-6">
                                <FileUp className="text-zinc-500 group-hover:text-primary transition-colors" size={28} />
                            </div>
                            <div className="text-center">
                                <p className="text-md font-bold text-foreground font-mono uppercase italic tracking-wider">Upload Tech Packs / Branding Assets</p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-2 font-mono">PDF, AI, SVG, High-Res PNG (Max 10MB per file)</p>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 font-mono text-[10px] text-zinc-300">
                                        <span className="truncate max-w-[150px]">{file.name}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                            className="text-zinc-500 hover:text-red-500"
                                            aria-label={`Remove file ${file.name}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <div className="pt-10 flex flex-col items-center gap-8">
                    <button
                        disabled={isSubmitting || items.length === 0}
                        className="w-full px-16 py-6 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_60px_rgba(245,158,11,0.3)] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none transition-all scale-100 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                                Processing RFQ...
                            </>
                        ) : (
                            <>
                                Initiate Factory Negotiation
                                <ArrowRight size={20} strokeWidth={3} />
                            </>
                        )}
                    </button>
                    <div className="flex items-center gap-3 text-zinc-500 group">
                        <Info size={14} className="group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">No commitment required · Verified factory network · 48h Response SLA</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
