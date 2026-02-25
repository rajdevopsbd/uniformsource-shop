export type Category = 'school' | 'corporate' | 'hospitality' | 'sports';

export interface Product {
    id: string;
    name: string;
    category: Category;
    description: string;
    fabric: string;
    gsm: number;
    MOQ: number;
    basePriceUSD: number;
    leadTimeDays: number;
    imageUrls: string[];
    certifications: string[];
    active: boolean;
    specs?: Record<string, string>;
    sizeChart?: Record<string, any>;
}

export type QuoteStatus = 'new' | 'assigned' | 'quoted' | 'closed';

export interface QuoteRequestItem {
    productId: string;
    quantity: number;
    sizes: string[];
    customizationNotes?: string;
}

export interface QuoteRequest {
    id: string;
    companyId: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    industry: string;
    deliveryCountry: string;
    targetDeliveryDate: string;
    budgetRange: string;
    items: QuoteRequestItem[];
    attachments: string[];
    status: QuoteStatus;
    createdAt: any;
}

export interface QuoteResponse {
    id: string;
    quoteRequestId: string;
    supplierId: string;
    unitPrice: number;
    setupCost: number;
    sampleCost: number;
    leadTime: number;
    paymentTerms: string;
    createdAt: any;
}

export interface UserRole {
    role: 'admin' | 'buyer' | 'supplier';
    companyId?: string;
}
