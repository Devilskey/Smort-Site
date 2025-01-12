import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { IMyProfile } from "../Api/ApiObjects/userObjects"
import React from "react"
import { smortApi as smort } from "../Api/smortApi"
import Style from './Navbar.module.scss';
import logo from '../SiteAssets/Smort_Logo.png';
import { Link, useLocation } from "react-router-dom";

export class NavBarSmort extends React.Component {

  render() {
    const user = smort.getUser();

    console.log("USer nav", user)

    var link = user !== undefined ? "/account" : "/login";

    return (
      <>
        <Navbar expand="lg" className={Style.Nav}>
          <Container>
            <Navbar.Brand as={Link} to="/"><img
              src={logo}
              width="60"
              height="60"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            /> </Navbar.Brand>


            <Navbar.Toggle aria-controls="basic-navbar-nav" className={Style.collapse} >
            <span className="navbar-toggler-icon" style={{ backgroundColor: 'white' }}></span> {/* Custom color */}

             </Navbar.Toggle>

            <Navbar.Collapse >
              <div className={"d-flex justify-content-between align-items-center " + Style.navItem} >

                <div className={Style.SearchBarDiv}>
                  <input type="text" className={Style.SearchBarText} />
                  <button>Search</button>

                </div>
                <Nav.Link as={Link} to={link}>
                  {user !== undefined ? (
                    <div className={Style.User}>
                      <div className={Style.UserText}> {user?.username}</div>
                      <img

                        src={smort.GetImageUrl(user?.profile_Picture)}
                        width="60"
                        height="60"
                        className={Style.UserImg}
                        alt="React Bootstrap logo" />
                    </div>) :
                    (<div>
                      Login/ Create Account
                    </div>)
                  }
                </Nav.Link>
              </div>
            </Navbar.Collapse >
          </Container>
        </Navbar >
      </>
    )
  }
}