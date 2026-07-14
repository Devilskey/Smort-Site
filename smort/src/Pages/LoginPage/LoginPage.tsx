
import { ReactElement, useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Style from './LoginPage.module.scss';
import { smortApi as smort } from "../../Api/smortApi";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { auth, githubProvider, googleProvider, waitForAuth } from "../../configs/FirebaseConfig";

export enum Providers {
  github,
  google
}

export const LoginPage = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [errorCode, setErrorCode] = useState<string>("");

  const homepageRoute = "/home";
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [Login, setLogin] = useState(true);

  const HandleLoginErrors = (error: any) => {
    switch (error.code) {
      case 'auth/invalid-email':
        setErrorCode('Invalid email adres')
        break;
      case 'auth/user-not-found':
        setErrorCode('User not found')
        break;
      case 'auth/wrong-password':
        setErrorCode('Wrong password')
        break;
      case 'auth/invalid-credential':
        setErrorCode('Invalid credentials')
        break;
      case 'auth/too-many-requests':
        setErrorCode('To many requests try again later')
        break;
      case 'auth/internal-error':
        setErrorCode('Internal error try again later')
        break;
      case 'auth/weak-password':
        setErrorCode('Password should be at least 6 characters!')
        break;
      default:
        console.log(error)
        setErrorCode('OOOPSie SoMeThInG BrOkE')
        break;
    }
  }

  useEffect(() => {
    const handleRedirect = async () => {
      const firebaseLogin = await waitForAuth();

      if (!firebaseLogin) {
        return;
      }

      smort.GetMyProfileAsync()
        .then(user => {
          navigate(homepageRoute);
        })
        .catch((error) => {
        });
    }
    handleRedirect();
  }, []);

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

      console.log(token);
    }).catch(HandleLoginErrors);
  }

  const loginWithProvider = async (providerSelected: Providers) => {
    let provider;
    try {

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

      const result = await signInWithRedirect(auth, provider);

    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const submitCreateAccount = (): void => {
    if (!username || !password || !email) {
      setErrorCode(`${username === "" ? "Username missing" : ""} 
        ${password === "" ? "password missing " : ""} 
        ${email === "" ? "email missing " : ""} `)
      return;
    }
    createNewAccount();
  };

  return (<>
    <div>
      <Container fluid className={"d-flex justify-content-center align-items-center " + Style.LoginPage}>
        <div className={Style.GradiantBackground}>
          <h1 className={Style.GradiantText + " " + Style.Title}>Smort</h1>
        </div>
        <div className={Style.LoginBackground}>
          <h1 className="text-center">    {Login ? (<>inloggen</>) : (<> Aanmelden</>)}</h1>
          {Login ? (
            <>
              <Form>
                <Form.Group as={Row} className={Style.Row}>
                  <Col sm="12">
                    <Form.Control
                      defaultValue={email}
                      className={Style.InputFields}
                      type="text"
                      placeholder="enter email"
                      onChange={(Element) => { setEmail(Element.target.value) }} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className={Style.Row}>
                  <Col sm="12">
                    <Form.Control
                      type="password"
                      className={Style.InputFields}
                      defaultValue={password}
                      placeholder="enter password"
                      onChange={(Element) => { setPassword(Element.target.value) }} />
                  </Col>
                </Form.Group>
                <div className={"d-grid gap-2 " + Style.Submit}>
                  <Button size="lg" variant="primary" type="submit"
                    onClick={(event) => {
                      event.preventDefault();
                      submitLogin()
                    }}>
                    Login
                  </Button>
                </div>
              </Form>
              <Button onClick={() => loginWithProvider(Providers.google)}>Login Google</Button>
              <Button onClick={() => loginWithProvider(Providers.github)}>Login Github</Button>
            </>
          ) : (
            <> <Form>
              <Form.Group as={Row} className={Style.Row}>
                <Col sm="12">
                  <Form.Control
                    required
                    type="text"
                    placeholder="enter Username"
                    className={Style.InputFields}
                    onChange={(Element) => { setUsername(Element.target.value) }} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className={Style.Row}>
                <Col sm="12">
                  <Form.Control
                    required
                    type="text"
                    placeholder="enter email"
                    className={Style.InputFields}
                    onChange={(Element) => { setEmail(Element.target.value) }} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className={Style.Row} >
                <Col>
                  <Form.Control type="password"
                    required
                    placeholder="enter password"
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
                  Create new account
                </Button>
              </div>
            </Form></>
          )}
          {errorCode !== "" &&
            <div className={Style.error}>
              {errorCode}
            </div>}


          <Button className={Style.SwitchRequest} onClick={() => {
            setLogin(!Login)
            setErrorCode("");
          }}>
            {Login ? (<>Aanmelden</>) : (<>inloggen</>)}
          </Button>
        </div>
      </Container>
    </div>
  </>)
}