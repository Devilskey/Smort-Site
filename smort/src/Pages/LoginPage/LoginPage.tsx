
import { JSX, useEffect, useRef, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Style from './LoginPage.module.scss';
import { smortApi as smort } from "../../Api/smortApi";
import { useNavigate } from "react-router-dom";

export const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState("enter email");
  const [username, setUsername] = useState("enter email");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [Login, setLogin] = useState(true);
  const inputRefrence = useRef<HTMLInputElement>(null)
  const [ProfilePicture, setProfilePicture] = useState<File | null>(null);

  const submitLogin = (): void => {
    smort.LoginAsync(email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };
  const submitCreateAccount = (): void => {
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

    <div className={Style.LoginBG}>
      <Container fluid className={"d-flex justify-content-center align-items-center " + Style.LoginPage}>
        <div className={Style.GradiantBackground}>
          <h1 className={Style.GradiantText + " " +  Style.Title}>Smort</h1>
          <h3 className={Style.GradiantText}> A hobby social media platform </h3>
        </div>
        <div className={Style.LoginBackground}>
          <h1 className="text-center">    {Login ? (<>inloggen</>) : (<> Aanmelden</>)}</h1>
          {Login ? (
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">email:</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    placeholder="enter email"
                    onChange={(Element) => { setEmail(Element.target.value) }} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="2">password:</Form.Label>
                <Col sm="10">
                  <Form.Control type="password"
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
                  Submit
                </Button>
              </div>
            </Form>
          ) : (
            <> <Form>
              <Form.Group as={Row}>
                <Col>
                  <input
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
                      {ProfilePicture ? (<img src={URL.createObjectURL(ProfilePicture)} />) : (<div> + </div>)}
                    </Button>
                  </div>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="2">Username:</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    placeholder="enter Username"
                    onChange={(Element) => { setUsername(Element.target.value) }} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="2">email:</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    placeholder="enter email"
                    onChange={(Element) => { setEmail(Element.target.value) }} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="2">password:</Form.Label>
                <Col sm="10">
                  <Form.Control type="password"
                    placeholder="enter password"
                    onChange={(Element) => { setPassword(Element.target.value) }} />
                </Col>
              </Form.Group>
              <div className={"d-grid gap-2 " + Style.Submit}>
                <Button size="lg" variant="primary" type="submit"
                  onClick={(event) => {
                    event.preventDefault();
                    submitCreateAccount()
                  }}>
                  Submit
                </Button>
              </div>
            </Form></>
          )}

          <button onClick={() => {
            setLogin(!Login)
          }}>
            {Login ? (<>Aanmelden</>) : (<>inloggen</>)}
          </button>
        </div>
      </Container>
    </div>
  </>)
}