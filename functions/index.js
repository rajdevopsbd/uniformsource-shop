import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";

initializeApp();

export const onQuoteRequestCreated = onDocumentCreated("quoteRequests/{requestId}", (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        logger.error("No data associated with the event");
        return;
    }
    const data = snapshot.data();

    logger.info("New Quote Request Created", {
        requestId: event.params.requestId,
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        itemCount: data.items ? data.items.length : 0
    });

    // Placeholder for admin notification hook
    // Example: sendEmailToAdmin(data);

    return null;
});
