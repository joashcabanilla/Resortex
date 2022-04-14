import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyA1CFmWYZwc9mbNeE9s_P3DjvgZmWno-aw",
    authDomain: "resortex-2022-02.firebaseapp.com",
    databaseURL: "https://resortex-2022-02-default-rtdb.firebaseio.com",
    projectId: "resortex-2022-02",
    storageBucket: "resortex-2022-02.appspot.com",
    messagingSenderId: "73681784072",
    appId: "1:73681784072:web:4a12b15f6507f5b2bb30bd"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);
