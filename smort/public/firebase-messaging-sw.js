importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase config (kept in sync with src/Settings/Settings.json)
firebase.initializeApp({
  apiKey: "AIzaSyC0-v8M35nL1hSxm1mdy6GoSr3pyBMzLOE",
  authDomain: "socials-53def.firebaseapp.com",
  projectId: "socials-53def",
  storageBucket: "socials-53def.firebasestorage.app",
  messagingSenderId: "878376503392",
  appId: "1:878376503392:web:c595abc392a3e5437a1b05",
  measurementId: "G-R79KT9VEFC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'Background Notification';
  const options = {
    body: (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || '',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png'
  };
  self.registration.showNotification(title, options);
});

// Fallback: handle raw push events
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || '',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
