import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-800 bg-zinc-950 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gradient">UniformSource</h3>
                        <p className="text-muted text-sm leading-relaxed max-w-xs">
                            Factory-direct uniform procurement for global organizations.
                            Streamlining the path from design to delivery.
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:legal@sleekapparels.com"
                                    className="flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm"
                                >
                                    <Mail size={16} />
                                    legal@sleekapparels.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+8801861011367"
                                    className="flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm"
                                >
                                    <Phone size={16} />
                                    +8801861011367
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Navigation</h4>
                        <ul className="grid grid-cols-2 gap-2 text-sm">
                            <li><Link href="/products" className="text-muted hover:text-primary transition-colors">Products</Link></li>
                            <li><Link href="/quote" className="text-muted hover:text-primary transition-colors">Request Quote</Link></li>
                            <li><Link href="/about" className="text-muted hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/suppliers" className="text-muted hover:text-primary transition-colors">For Suppliers</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Legal Footer - Mandatory */}
                <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col items-center text-center gap-4">
                    <p className="text-xs text-muted max-w-2xl">
                        UniformSource is operated by{" "}
                        <span className="text-foreground font-medium">Sleek Apparels LLC (Kentucky, USA)</span> and{" "}
                        <span className="text-foreground font-medium">Sleek Apparels Limited (Dhaka, Bangladesh)</span>.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                        <span>© {new Date().getFullYear()} UniformSource</span>
                        <span>All Rights Reserved</span>
                        <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
