
import { JSX, useEffect, useRef, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Style from './LoginPage.module.scss';
import { smortApi as smort } from "../../Api/smortApi";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [Login, setLogin] = useState(true);
  const inputRefrence = useRef<HTMLInputElement>(null)
  const [ProfilePicture, setProfilePicture] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const submitLogin = (): void => {
    smort.LoginAsync(email, password)
      .then((Success: boolean) => {
        console.log(Success)
        if (Success) {
          navigate("/Home");
        } else {
          setErrorMessage("failed to login please try again with a different password or email address");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };
  const submitCreateAccount = (): void => {
    if (!username || !ProfilePicture || !password || !email) {
      setErrorMessage(`${username === "" ? "Username missing" : ""} 
        ${!ProfilePicture ? "Profile picture missing " : ""} 
        ${password === "" ? "password missing " : ""} 
        ${email === "" ? "email missing " : ""} `)
      return;
    }

    if (ProfilePicture !== null) {
      smort.CreateAccountAsync(email, password, ProfilePicture, username)
        .then(() => {
          setLogin(!Login);
        })
        .catch((error) => {
          console.error("Create account failed:", error);
        });
    }
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
          ) : (
            <> <Form>
              <Form.Group as={Row} className={Style.Row}>
                <Col>
                  <input
                    required
                    type="file"
                    placeholder="enter email"
                    hidden
                    onChange={(Element) => {
                      setProfilePicture(Element.target.files?.[0] || null)

                    }}
                    ref={inputRefrence} />
                  <div className={Style.ProfilePictureAddDiv}>
                    <Button
                      className={Style.PfPicture}
                      onClick={() => {
                        inputRefrence.current?.click()
                      }}>
                      {ProfilePicture ? (<img src={URL.createObjectURL(ProfilePicture)} />) : (<div> Upload Profile Picture</div>)}
                    </Button>
                  </div>
                </Col>
              </Form.Group>

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
          {errorMessage !== "" &&
            <div className={Style.error}>
              {errorMessage}
            </div>}


          <Button className={Style.SwitchRequest} onClick={() => {
            setLogin(!Login)
            setErrorMessage("");
          }}>
            {Login ? (<>Aanmelden</>) : (<>inloggen</>)}
          </Button>
        </div>
      </Container>
    </div>
  </>)
}