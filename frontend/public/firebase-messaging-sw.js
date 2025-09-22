// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.7.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.7.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBo0U1OMSkx3mdjs0KGaTGcafqOgDUY1Sg",
  authDomain: "push-notification-6787b.firebaseapp.com",
  projectId: "push-notification-6787b",
  storageBucket: "push-notification-6787b.appspot.com",
  messagingSenderId: "181960348200",
  appId: "1:181960348200:web:77424b9db7e691df44db1d",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Registering Service Worker
async function subscribeUser() {
  const serviceWorkerRegistration = await navigator.serviceWorker
    .register("./sw.js", { scope: "./" })
    .catch((err) => {
      return console.log("[Service Worker] Registration Error:", err);
    });
  console.log(
    "[Service Worker] Registered. Scope:",
    serviceWorkerRegistration.scope
  );

  // await navigator.serviceWorker.ready;
  // Here's the waiting
  navigator.serviceWorker.ready.then((reg) =>
    reg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      })
      .catch((err) => {
        return console.log("[Web Push] Registration Error:", err);
      })
  );

  // Registering push
  // const subscription = await serviceWorkerRegistration.pushManager
  //   .subscribe({
  //     userVisibleOnly: true,
  //     applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  //   })
  //   .catch((err) => {
  //     return console.log("[Web Push] Registration Error:", err);
  //   });
  console.log("[Web Push] Registered");
}

subscribeUser();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: payload.notification.image,
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  console.log("notificationclick", event)
  var urlToRedirect = event.notification.data.url;
  event.notification.close();
  event.waitUntil(self.clients.openWindow(urlToRedirect));
});
