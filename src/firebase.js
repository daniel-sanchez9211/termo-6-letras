import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDjTmOX4yo3Ww3Y5wtog9bOZXdpgxezZzA",
    authDomain: "emprestaai-6534a.firebaseapp.com",
    databaseURL: "https://emprestaai-6534a.firebaseio.com",
    projectId: "emprestaai-6534a",
    storageBucket: "emprestaai-6534a.appspot.com",
    messagingSenderId: "669707699435",
    appId: "1:669707699435:web:cf7e1849aa1081d4eaaaae",
    measurementId: "G-7CHJWT1BCF"
};

const app = initializeApp(firebaseConfig);

export default app