import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { IMyProfile } from "../Api/ApiObjects/userObjects"
import React, { useEffect, useState } from "react"
import { smortApi as smort } from "../Api/smortApi"
import Style from './Navbar.module.scss';
import logo from '../SiteAssets/Smort_Logo.png';
import { Link, useLocation } from "react-router-dom";
import { AndroidHandler } from "../PlatformSpecificScripts/Android";

interface props {
  Search: (search: string) => void;
}



export const NavBarSmortPc = (props: props): JSX.Element => {

  let InstallPromptEvent: any;
  const user = smort.getUser();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      InstallPromptEvent = event;
    })
  }, [])

  return (
    <>
      <Navbar expand="lg" className={Style.Nav}>
        <Container>
          <Navbar.Brand as={Link} to="/Home"><img
            src={logo}
            width="60"
            height="60"
            className={Style.Logo}
            alt="React Bootstrap logo"
          /> </Navbar.Brand>

          <div className={Style.SearchBarDiv}>
            <input
              type="text" className={Style.SearchBarText}
              onChange={(event) => {
                setSearch(event.target.value);
                props.Search(event.target.value)
              }} />
            <div className="input-group-prepend">
              <div className="input-group-text">@</div>
            </div>
          </div>

          <Nav >
            <Nav.Link as={Link} to={"/account"}>
              {user !== undefined ? (
                <div className={Style.User}>
                  <div className={Style.UserText}> {user?.username}</div>
                  <img
                    src={smort.GetImageUrl(user?.profile_Picture, false)}
                    width="60"
                    height="60"
                    className={Style.UserImg}
                    alt="" />
                </div>) :
                (<div className={Style.WhiteTekst}>
                  Login/ Create Account
                </div>)
              }
            </Nav.Link>
          </Nav>
          {AndroidHandler.IsUsingAndroid() &&
            <div className={Style.WhiteTekst} onClick={() => {
              InstallPromptEvent.prompt();
            }}>
              Install App
            </div>
          }

        </Container>
      </Navbar >
    </>
  )
}