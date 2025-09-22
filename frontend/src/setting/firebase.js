import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// Replace this firebaseConfig object with the congurations for the project you created on your firebase console.
const firebaseConfig = {
    apiKey: "AIzaSyAiw6fHNt5nFlPOVrPYvF6CzZ4Fm-kavhs",
    authDomain: "rabs-messenger.firebaseapp.com",
    projectId: "rabs-messenger",
    storageBucket: "rabs-messenger.appspot.com",
    messagingSenderId: "980657572174",
    appId: "1:980657572174:web:f80db9509555b10263361f",
    measurementId: "G-7DD8VX7WJ6"
  };
const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging();
export const messaging = getMessaging(app);

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
