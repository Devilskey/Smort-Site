import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getRedirectResult, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import settings from '../Settings/Settings.json'
import { smortApi } from "../Api/smortApi";
import {
  getMessaging,
  getToken,
  onMessage
} from "firebase/messaging";

const firebaseConfig = settings as FirebaseOptions;

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app)

const messaging = getMessaging(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account"
})

const githubProvider = new GithubAuthProvider();

const waitForAuth = async (): Promise<User | null> => {

    return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            smortApi.Token = user ? await user.getIdToken(): "";
            unsub();
            resolve(user);
        });
    });
}

const NotificationHandler = (): void => {

  Notification.requestPermission().then(async (permission) => {
      if (permission !== "granted") return;

      // Register (or get) the SW and wait until it's active
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      // Wait for the SW to be in the "active" state
      const activeSW = await navigator.serviceWorker.ready;

      getToken(messaging, { 
          vapidKey: "BCOCYas6cyvifaJAvBrYoRIMZgV9XWrjel_Cy6b-1_y9v-zjhMmq72G71006mFDnhJzLIo0opjuKeqHMKQrHZeY",
          serviceWorkerRegistration: activeSW,
      }).then(async (currentToken) => {
            if (currentToken) {
              await smortApi.RegisterFcmToken(currentToken);
            } else {
              console.log("No registration token available.");
            }
          })
          .catch((err) => console.log("Token error:", err));


  });
}

const notifications:Record<string, string> = {
  "en.Notify.NewLike.Body": "You have a new like from {@}!",
  "en-us.Notify.NewLike.Body": "You have a new like from {@}!",
  "nl-nl.Notify.NewLike.Body": "Je hebt een nieuwe Like van {@}",
};



onMessage(messaging, (payload) => {
  // Display toast or update UI state
  });

const checkRedirect = async () => {
    try {
      const result = await getRedirectResult(auth);
      
    } catch (error) {
      console.error("REDIRECT AUTH ERROR:", error);
    }
};
    
export {auth, githubProvider, googleProvider, analytics, messaging, waitForAuth, checkRedirect, onMessage, NotificationHandler }