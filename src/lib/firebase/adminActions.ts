import { db } from './config';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { QuoteStatus } from '@/types';

/**
 * Updates the status of a quote request and logs the action.
 */
export async function updateQuoteStatus(
    id: string,
    status: QuoteStatus,
    adminUid: string
): Promise<void> {
    const ref = doc(db, 'quoteRequests', id);
    await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
        activityLog: arrayUnion({
            action: `Status changed to "${status}"`,
            adminUid,
            timestamp: new Date().toISOString(),
        }),
    });
}

/**
 * Saves admin notes for a quote request and logs the action.
 */
export async function saveAdminNotes(
    id: string,
    notes: string,
    adminUid: string
): Promise<void> {
    const ref = doc(db, 'quoteRequests', id);
    await updateDoc(ref, {
        adminNotes: notes,
        updatedAt: serverTimestamp(),
        activityLog: arrayUnion({
            action: 'Admin notes updated',
            adminUid,
            timestamp: new Date().toISOString(),
        }),
    });
}

/**
 * Logs that an admin viewed a quote request.
 */
export async function logAdminView(
    id: string,
    adminUid: string
): Promise<void> {
    const ref = doc(db, 'quoteRequests', id);
    await updateDoc(ref, {
        activityLog: arrayUnion({
            action: 'Quote viewed by admin',
            adminUid,
            timestamp: new Date().toISOString(),
        }),
    });
}
