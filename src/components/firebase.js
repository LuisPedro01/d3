import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyATWncGVNiuiq6hjApLhFT0nl3HjopJ7_M",
    authDomain: "exemplo-b69b2.firebaseapp.com",
    projectId: "exemplo-b69b2",
    storageBucket: "exemplo-b69b2.appspot.com",
    messagingSenderId: "967941832830",
    appId: "1:967941832830:web:5096cff3b88f0a2be0582f",
    measurementId: "G-1BETWRRZ1P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };