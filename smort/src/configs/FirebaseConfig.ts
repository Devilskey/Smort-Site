import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import settings from '../Settings/Settings.json'
import Cookies from "js-cookie";

const firebaseConfig = settings as FirebaseOptions;

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const waitForAuth = (): Promise<User | null> => {
    return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            Cookies.set("jwtToken", await user?.getIdToken() ?? "");

            unsub();
            resolve(user);
        });
    });
}

export {auth, githubProvider, googleProvider, analytics, waitForAuth}