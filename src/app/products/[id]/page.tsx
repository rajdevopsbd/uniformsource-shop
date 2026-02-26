import ProductDetail from '@/components/products/ProductDetail';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Product } from '@/types';

export async function generateStaticParams() {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('active', '==', true));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
    } catch (err) {
        console.error("Error in generateStaticParams:", err);
        return [];
    }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const docRef = doc(db, 'products', id);
    let docSnap;

    try {
        docSnap = await getDoc(docRef);
    } catch (err) {
        console.error("Error fetching product:", err);
    }

    if (!docSnap?.exists() || !docSnap.data().active) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-32">
                <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
                <p className="text-muted">The product you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    const product = {
        id: docSnap.id,
        ...docSnap.data()
    } as Product;

    return <ProductDetail product={product} />;
}
