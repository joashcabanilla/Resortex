import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyA2FLlUM1llugqQI0QtkE4YPrcvzCxlxV8",
    authDomain: "hotel-reservation-system-2022.firebaseapp.com",
    databaseURL: "https://hotel-reservation-system-2022-default-rtdb.firebaseio.com",
    projectId: "hotel-reservation-system-2022",
    storageBucket: "hotel-reservation-system-2022.appspot.com",
    messagingSenderId: "122218454370",
    appId: "1:122218454370:web:e5c2c2ed46aef39749e03b"
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : null;

export default firebase;