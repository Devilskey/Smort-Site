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

const notifications = {
  "en.Notify.NewLike.Body": "You have a new like from {@}!",
  "en-us.Notify.NewLike.Body": "You have a new like from {@}!",
  "nl-nl.Notify.NewLike.Body": "Je hebt een nieuwe Like van {@}!",

  "en.Notify.NewFollow.Body": "You have a new follower {@}!",
  "en-us.Notify.NewFollow.Body": "You have a new follower {@}!",
  "nl-nl.Notify.NewFollow.Body": "Je hebt een nieuwe volger {@}!",

  "en.Notify.NewVideo.Body": "{@} has uploaded a new video!",
  "en-us.Notify.NewVideo.Body": "{@} has uploaded a new video!!",
  "nl-nl.Notify.NewVideo.Body": "{@} heeft een nieuwe video geupload!",


  "en.Notify.NewImage.Body": "{@} has uploaded a new photo!",
  "en-us.Notify.NewImage.Body": "{@} has uploaded a new photo!",
  "nl-nl.Notify.NewImage.Body": "{@} heeft een nieuwe foto geupload!",

};

const messaging = firebase.messaging();

const translateNotification = (text) => {

  if(!text){
    return "";
  }    
  
  const nav = window.navigator;
  
  const browserLanguage = localStorage.getItem("language") ? localStorage.getItem("language") : 
   Array.isArray(nav.languages) && nav.languages.length > 0
    ? nav.languages[0]
    : nav.language || "en";
  

  const separatorIndex = text.indexOf(":");

  if (separatorIndex === -1) {
    return notifications[`${browserLanguage}.${text}`] || text;
  }

  const key = text.substring(0, separatorIndex);
  const value = text.substring(separatorIndex + 1);

  let translated = notifications[`${browserLanguage}.${key}`];

  // Translation doesn't exist
  if (!translated) {
    return text;
  }

  // Replace {@} with the value
  translated = translated.replaceAll("{@}", value);

  return translated;

}

messaging.onBackgroundMessage(function(payload) {
  const titlePayload = "Smort socials"
  const bodypayload = (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || ''

  const options = {
    body: translateNotification(bodypayload),
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png'
  };

  self.registration.showNotification(title, options);
});

// Fallback: handle raw push events
// self.addEventListener('push', function(event) {
//   const data = event.data ? event.data.json() : {};
//   const title = data.title || 'New Notification';
//   const options = {
//     body: data.body || '',
//     icon: '/android-chrome-192x192.png',
//     badge: '/android-chrome-192x192.png'
//   };
//   event.waitUntil(self.registration.showNotification(title, options));
// });
