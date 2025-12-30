import firebase from 'firebase/compat/app';
import 'firebase/compat/database'; // É necessário importar isso para habilitar o .database()

const firebaseConfig = {
  apiKey: "AIzaSyAK6S4jS4hshWY2t0jMUu1a82EEczk70lk",
  authDomain: "yngrid-melo-depiladora.firebaseapp.com",
  projectId: "yngrid-melo-depiladora",
  storageBucket: "yngrid-melo-depiladora.firebasestorage.app",
  messagingSenderId: "646448679908",
  appId: "1:646448679908:web:016d82a01d35eb0c9e55f1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

export { database };