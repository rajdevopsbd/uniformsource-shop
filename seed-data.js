
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const products = [
    {
        name: "Classic Cotton Blazer",
        description: "Premium cotton blazer for corporate environments.",
        price: 45.00,
        category: "corporate",
        active: true,
        MOQ: 50,
        leadTimeDays: 14,
        images: ["https://placehold.co/600x400?text=Blazer"],
        createdAt: serverTimestamp()
    },
    {
        name: "Polo Shirt - Navy",
        description: "Durable cotton-poly blend polo shirt.",
        price: 15.00,
        category: "sports",
        active: true,
        MOQ: 100,
        leadTimeDays: 7,
        images: ["https://placehold.co/600x400?text=Polo"],
        createdAt: serverTimestamp()
    }
];

async function seed() {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        console.log("Seeding products...");
        for (const p of products) {
            const docRef = await addDoc(collection(db, 'products'), p);
            console.log("Added product with ID:", docRef.id);
        }
        console.log("Seeding complete!");
    } catch (err) {
        console.error("Error seeding:", err);
    }
}

seed();
