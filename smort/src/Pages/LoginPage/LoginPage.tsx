
import { ReactElement, useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Style from './LoginPage.module.scss';
import { smortApi as smort } from "../../Api/smortApi";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getRedirectResult, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { auth, checkRedirect, githubProvider, googleProvider, waitForAuth } from "../../configs/FirebaseConfig";
import { useTranslation } from "../../translations/TranslationProvider";
import { GithubLogo, GoogleLogo, UsersIcon } from "../../core/Icon";

export enum Providers {
  github,
  google
}

export const LoginPage = (): ReactElement => {
  const [email, setEmail] = useState("");

  const [errorCode, setErrorCode] = useState<string>("");

  const homepageRoute = "/home";
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [Login, setLogin] = useState(true);
  const { t } = useTranslation();

  
  useEffect(() => {

    const getAuth = async () => {
      await checkRedirect();

      const user = await waitForAuth();
      if (user || auth.currentUser) {
        navigate('/home');
      }
    }
    getAuth();

  }, []);

  const HandleLoginErrors = (error: any) => {
    switch (error.code) {
      case 'auth/invalid-email':
        setErrorCode('Invalid email adres')
        break;
      case 'auth/user-not-found':
        setErrorCode('User not found')
        break;
      case 'auth/wrong-password':
        setErrorCode(t('login.errorWrongPassword'))
        break;
      case 'auth/invalid-credential':
        setErrorCode(t('login.errorInvalidCredential'))
        break;
      case 'auth/too-many-requests':
        setErrorCode(t('login.errorTooManyRequests'))
        break;
      case 'auth/internal-error':
        setErrorCode(t('login.errorInternalError'))
        break;
      case 'auth/weak-password':
        setErrorCode(t('login.errorWeakPassword'))
        break;
      default:
        setErrorCode(t('login.errorDefault'))
        break;
    }
  }

  const submitLogin = (): void => {
    signInWithEmailAndPassword(auth, email, password).then(async (Success) => {
      const token = await auth.currentUser?.getIdToken();
      window.localStorage.setItem("Token", token ?? "");
      navigate(homepageRoute);
    }).catch(HandleLoginErrors);
  };

  const createNewAccount = (): void => {
    createUserWithEmailAndPassword(auth, email, password).then(async (credentials) => {
      const token = await auth.currentUser?.getIdToken();
      window.localStorage.setItem("Token", token ?? "");
      navigate(homepageRoute);
    }).catch(HandleLoginErrors);
  }

  const loginWithProvider = async (providerSelected: Providers) => {
    try {
      let provider;

      switch (providerSelected) {
        case Providers.google:
          provider = googleProvider;
          break;

        case Providers.github:
          provider = githubProvider;
          break;

        default:
          setErrorCode('Unsupported provider was given Error 405')
          throw new Error("Unsupported provider");
      }

      await signInWithRedirect(auth, provider);

    } catch (error) {
      console.error("Login failed:", error);
      setErrorCode(t('login.errorDefault'));
    }
  };

  const submitCreateAccount = (): void => {
    if (!password || !email) {
      setErrorCode(` ${password === "" ? t('login.passwordMissing') : ""} 
        ${email === "" ? t('login.emailMissing') : ""}`)
      return;
    }
    createNewAccount();
  };

  return (<>
    <div>
      <Container fluid className={"d-flex justify-content-center align-items-center " + Style.LoginPage}>
        {/* <div className={Style.GradiantBackground}>
          <h1 className={Style.GradiantText + " " + Style.Title}>Smort</h1>
        </div> */}
        <div className={Style.LoginBackground}>

          <div className={Style.LoginIcon}>
            <UsersIcon/>
          </div>

          <h1 className="text-center">{Login ? t('login.titleSignIn') : t('login.titleSignUp')}</h1>
          {Login ? (
            <>
              <Form>
                <Form.Group as={Row} className={Style.Row}>
                  <Col sm="12">
                    <Form.Control
                      defaultValue={email}
                      className={Style.InputFields}
                      type="text"
                      placeholder={t('login.placeholderEmail')}
                      onChange={(Element) => { setEmail(Element.target.value) }} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className={Style.Row}>
                  <Col sm="12">
                    <Form.Control
                      type="password"
                      className={Style.InputFields}
                      defaultValue={password}
                      placeholder={t('login.placeholderPassword')}
                      onChange={(Element) => { setPassword(Element.target.value) }} />
                  </Col>
                </Form.Group>
                <div className={"d-grid gap-2 " + Style.Submit}>
                  <Button size="lg" variant="primary" type="submit"
                    onClick={(event) => {
                      event.preventDefault();
                      submitLogin()
                    }}>
                    {t('login.buttonLogin')}
                  </Button>
                </div>
              </Form>
            </>
          ) : (
            <> 
              <Form>
                <Form.Group as={Row} className={Style.Row}>
                  <Col sm="12">
                    <Form.Control
                      required
                      type="text"
                      placeholder={t('login.placeholderEmail')}
                      className={Style.InputFields}
                      onChange={(Element) => { setEmail(Element.target.value) }} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className={Style.Row} >
                  <Col>
                    <Form.Control type="password"
                      required
                      placeholder={t('login.placeholderPassword')}
                      className={Style.InputFields}
                      onChange={(Element) => { setPassword(Element.target.value) }} />
                  </Col>

                </Form.Group>
                <div className={"d-grid gap-2 " + Style.Submit}>
                  <Button size="lg" variant="primary" type="submit"
                    onClick={(event) => {
                      event.preventDefault();
                      submitCreateAccount()

                    }}>
                    {t('login.buttonCreateAccount')}
                  </Button>
                </div>
              </Form>
            </>
          )}
          {errorCode !== "" &&
            <div className={Style.error}>
              {errorCode}
            </div>}
   

          <div className={Style.ContinueWithText}>
            <hr />
            <div>{t('login.continueWithText')}</div>
            <hr />
          </div>

          <div className={Style.containerOauthlogin}>
            <Button onClick={ () =>  loginWithProvider(Providers.google)}>
              <GoogleLogo/>{t('login.buttonLoginGoogle')}
              </Button>
            <Button onClick={ () =>  loginWithProvider(Providers.github)}>
              <GithubLogo/>{ t('login.buttonLoginGithub')} 
            </Button>
          </div>

            <footer>
              <hr/>
              <Button className={Style.SwitchRequest} onClick={() => {
                setLogin(!Login)
                setErrorCode("");
              }}>
                {Login ? t('login.switchToSignUp') : t('login.switchToSignIn')}
              </Button>
            </footer>
        </div>
      </Container>
    </div>
  </>)
}
