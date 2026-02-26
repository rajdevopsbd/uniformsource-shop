
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function test() {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        console.log("Attempting to fetch products...");
        const snap = await getDocs(collection(db, 'products'));
        console.log(`Success! Found ${snap.size} products.`);
        snap.forEach(doc => console.log(doc.id));
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
