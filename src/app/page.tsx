import Link from 'next/link';
import { ArrowRight, ShieldCheck, Factory, Truck, BarChart3, ChevronRight } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'School Uniforms', icon: <ArrowRight className="w-5 h-5" />, color: 'from-amber-500/20 to-amber-500/0' },
    { name: 'Corporate & Office Wear', icon: <ArrowRight className="w-5 h-5" />, color: 'from-cyan-500/20 to-cyan-500/0' },
    { name: 'Hospitality & Service', icon: <ArrowRight className="w-5 h-5" />, color: 'from-blue-500/20 to-blue-500/0' },
    { name: 'Sports & Teamwear', icon: <ArrowRight className="w-5 h-5" />, color: 'from-emerald-500/20 to-emerald-500/0' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Next Gen B2B Procurement</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
              Uniform procurement, <br />
              <span className="text-gradient">done right.</span>
            </h1>

            <p className="text-xl text-muted mb-12 leading-relaxed max-w-2xl">
              Factory-direct uniforms for schools, companies, and teams —
              transparent pricing, predictable delivery, and factory-verified suppliers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                Browse Products
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quote"
                className="px-8 py-4 bg-zinc-900 text-foreground font-bold rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-all flex items-center justify-center"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-8 border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <ShieldCheck className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Factory-verified</h3>
                <p className="text-xs text-muted">Audited production hubs</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <BarChart3 className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">MOQ Clarity</h3>
                <p className="text-xs text-muted">Transparent order volumes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <Factory className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Expertise</h3>
                <p className="text-xs text-muted">Bangladesh manufacturing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4 font-mono uppercase tracking-tighter italic">Industries We Serve</h2>
              <div className="w-20 h-1 bg-primary"></div>
            </div>
            <Link href="/products" className="text-sm font-bold text-primary flex items-center gap-2 hover:gap-3 transition-all">
              See All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/products?category=${cat.name.toLowerCase().split(' ')[0]}`}
                className={`group relative p-8 rounded-xl bg-surface border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-sm text-muted">Customized solutions for {cat.name.toLowerCase()}.</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="p-12 md:p-16 rounded-3xl glass relative overflow-hidden border-zinc-800 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full -z-10"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Ready to transform your <br />uniform procurement?</h2>
            <p className="text-muted text-lg mb-12 max-w-2xl mx-auto">
              Our supply chain experts are ready to help you source the perfect workwear
              for your organization with full transparency and quality control.
            </p>
            <Link
              href="/quote"
              className="inline-flex px-10 py-5 bg-foreground text-black font-extrabold rounded-xl hover:bg-zinc-200 transition-all scale-100 hover:scale-105 active:scale-95 shadow-2xl"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
