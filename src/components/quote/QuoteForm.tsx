"use client";

import { useState } from 'react';
import { Send, FileUp, Calendar, Globe, Building2, UserCircle, Mail, Phone, Info } from 'lucide-react';

export default function QuoteSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            localStorage.removeItem('us_quote_builder');
        }, 2000);
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Send className="text-primary w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4 font-mono uppercase italic">Quote Request Submitted</h2>
                <p className="text-muted text-lg mb-8 leading-relaxed">
                    Thank you for choosing UniformSource. Our procurement team will review your request
                    and assign it to verified suppliers within 24-48 business hours.
                    You will receive an email shortly.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-lg font-bold hover:bg-zinc-800 transition-colors"
                >
                    Return to Marketplace
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4 font-mono uppercase italic tracking-tight text-gradient inline-block">Request a Quote</h1>
                <p className="text-muted leading-relaxed max-w-2xl">
                    Complete the form below to submit your RFQ (Request for Quotation).
                    The more details you provide, the faster and more accurate our verified suppliers can be.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Company Info */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-2">Organization Details</h3>

                        <div className="space-y-4">
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Company/School Name"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground"
                                />
                            </div>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Delivery Country"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground"
                                />
                            </div>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="date"
                                    placeholder="Target Delivery Date"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground text-zinc-400"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-2">Primary Contact</h3>
                        <div className="space-y-4">
                            <div className="relative group">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground"
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="Official Email Address"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground"
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-primary transition-all text-foreground"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Requirements */}
                <section className="space-y-6">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-2">Project Scope & Customization</h3>
                    <div className="space-y-4">
                        <textarea
                            rows={5}
                            placeholder="Provide details on customization, sizes, and any specific fabric requirements..."
                            className="w-full p-6 bg-zinc-950 border border-zinc-800 rounded-2xl outline-none focus:border-primary transition-all text-foreground resize-none"
                        ></textarea>

                        <div className="p-8 border-2 border-dashed border-zinc-900 rounded-3xl hover:border-zinc-800 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer bg-zinc-950/20 group">
                            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <FileUp className="text-zinc-600 group-hover:text-primary transition-colors" size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-foreground">Upload Designs or Logos</p>
                                <p className="text-[10px] text-muted uppercase tracking-wider mt-1">PDF, AI, PNG (Max 10MB)</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-8 flex flex-col items-center gap-6">
                    <button
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-16 py-5 bg-primary text-black font-extrabold rounded-2xl hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] disabled:bg-zinc-800 disabled:text-zinc-500 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isSubmitting ? 'Processing RFQ...' : 'Submit Request for Quotation'}
                    </button>
                    <div className="flex items-center gap-2 text-muted">
                        <Info size={14} />
                        <span className="text-[10px] uppercase tracking-widest">No commitment required · Expert review included</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
