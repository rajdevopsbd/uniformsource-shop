import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, FileText } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-black">U</div>
                    <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">UniformSource</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/products" className="text-sm font-medium text-muted hover:text-primary transition-colors">Products</Link>
                    <Link href="/categories" className="text-sm font-medium text-muted hover:text-primary transition-colors">Categories</Link>
                    <Link href="/about" className="text-sm font-medium text-muted hover:text-primary transition-colors">How it Works</Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-muted hover:text-foreground transition-colors hidden sm:block">
                        <Search size={20} />
                    </button>
                    <Link href="/quote-builder" className="flex items-center gap-2 p-2 text-muted hover:text-primary transition-colors relative">
                        <FileText size={20} />
                        <span className="hidden sm:inline text-sm font-medium">Quote Builder</span>
                        {/* Notification badge if items in quote */}
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    </Link>
                    <button className="p-2 text-muted hover:text-foreground transition-colors">
                        <User size={20} />
                    </button>
                    <button className="p-2 text-muted hover:text-foreground md:hidden">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
