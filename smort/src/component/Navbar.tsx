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

    console.log("USer nav", user)

    var link = user !== undefined ? "/account" : "/login";



    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/"><img
              src={logo}
              width="60"
              height="60"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            /></Navbar.Brand>
            <Navbar.Brand as={Link} to={link}>
            { user !== undefined ?  (
            <div className={Style.User}>
              <div className={Style.UserText}> {user?.username}</div>
              <img
                src={smort.GetImageUrl(user?.profile_Picture)}
                width="60"
                height="60"
                className={ Style.UserImg}
                alt="React Bootstrap logo" />
            </div>)  :
             (<div>
              Login please
            </div>) 
            }
            </Navbar.Brand>
          </Container>


        </Navbar>
      </>
    )
  }
}