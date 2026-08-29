import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getRedirectResult, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import settings from '../Settings/Settings.json'
import { smortApi } from "../Api/smortApi";

const firebaseConfig = settings as FirebaseOptions;

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app)

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

const checkRedirect = async () => {
    try {
      const result = await getRedirectResult(auth);
      
    } catch (error) {
      console.error("REDIRECT AUTH ERROR:", error);
    }
};
    
export {auth, githubProvider, googleProvider, analytics, waitForAuth, checkRedirect}