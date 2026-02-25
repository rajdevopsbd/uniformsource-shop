import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}
