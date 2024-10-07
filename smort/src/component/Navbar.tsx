import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { IMyProfile } from "../Api/ApiObjects/userObjects"
import React from "react"
import { smortApi as smort } from "../Api/smortApi"
import Style from './Navbar.module.scss';

interface INavBar {
  profile?: IMyProfile
}

export class NavBarSmort extends React.Component {

  render() {

    const user = smort.getUser();

    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="/home"><img
              src="https://devilskey.nl/smortSocials/assets/Smort_Logo.png"
              width="60"
              height="60"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            /></Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
            <Navbar.Brand href=""></Navbar.Brand>
            <div className={Style.User}>
              <div className={Style.UserText}> {user?.username}</div>
              <img
                src={smort.GetImageUrl(user?.profile_Picture)}
                width="60"
                height="60"
                className={ Style.UserImg}
                alt="React Bootstrap logo" />
            </div>
          </Container>


        </Navbar>
      </>
    )
  }
}