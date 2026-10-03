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
  "nl-nl.Notify.NewImage.Body": "{@} heeft een nieuwe foto geupload!"
};

const messaging = firebase.messaging();

const translateNotification = (text) => {

  let browserLanguage = (navigator.language || "en").toLowerCase();

  if (browserLanguage !== "en-us" && browserLanguage !== "nl-nl") {
    browserLanguage = "en";
  }

  const separatorIndex = text.indexOf(":");

  if (separatorIndex === -1) {
    return notifications[`${browserLanguage}.${text}`] || text;
  }

  const key = text.substring(0, separatorIndex);
  const value = text.substring(separatorIndex + 1);

  let translated = notifications[`${browserLanguage}.${key}`];

  if (!translated) {
    return text;
  }

  translated = translated.replaceAll("{@}", value);

  return translated;
};

messaging.onBackgroundMessage((payload) => {
  const title = "Smort socials";
  const originalBody = payload.data?.body || "";

  let body = originalBody;

  try {
    body = translateNotification(originalBody);
  } catch (e) {
    console.error("Translation failed:", e);
    body = originalBody;
  }

  self.registration.showNotification(title, {
    body: body,
    icon: "/NotificationIcon-192x192.png",
    badge: "/NotificationIcon-192x192.png"
  });
});