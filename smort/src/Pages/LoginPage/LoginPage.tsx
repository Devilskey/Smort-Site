
import { JSX, useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Style from './LoginPage.module.scss';
import { smortApi as smort } from "../../Api/smortApi";
import { useNavigate } from "react-router-dom";

export const LoginPage = (): JSX.Element => {
    const [email, setEmail] = useState("enter email");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submit = (): void => {
      smort.LoginAsync(email, password)
        .then(() => {
           navigate("/"); 
        })
        .catch((error) => {
          console.error("Login failed:", error); 
        });
    };
    return (<>
        <Container fluid className={"d-flex justify-content-center align-items-center " + Style.LoginPage}>
            <div className={Style.LoginBackground}>
                <h1 className="text-center">Login</h1>
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
                                submit()
                            }}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    </>)
}