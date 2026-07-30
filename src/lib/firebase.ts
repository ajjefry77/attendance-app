import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_bh8Bf0Jt0keWaBBESV2_Y8feAL5C9YQ",
  authDomain: "university-present.firebaseapp.com",
  projectId: "university-present",
  storageBucket: "university-present.firebasestorage.app",
  messagingSenderId: "843166018621",
  appId: "1:843166018621:web:572a1d24e35938b02a8e54",
  measurementId: "G-T7S5J022EM"
};

export const db = getFirestore(initializeApp(firebaseConfig));
