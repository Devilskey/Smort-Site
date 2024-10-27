import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { IMyProfile } from "../Api/ApiObjects/userObjects"
import React from "react"
import { smortApi as smort } from "../Api/smortApi"
import Style from './Navbar.module.scss';
import logo from '../SiteAssets/Smort_Logo.png';
import { Link } from "react-router-dom";

export class NavBarSmort extends React.Component {

  render() {

    const user = smort.getUser();

    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/home"><img
              src={logo}
              width="60"
              height="60"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            /></Navbar.Brand>
            <Navbar.Brand as={Link} to="/account">
            <div className={Style.User}>
              <div className={Style.UserText}> {user?.username}</div>
              <img
                src={smort.GetImageUrl(user?.profile_Picture)}
                width="60"
                height="60"
                className={ Style.UserImg}
                alt="React Bootstrap logo" />
            </div>
            </Navbar.Brand>
          </Container>


        </Navbar>
      </>
    )
  }
}