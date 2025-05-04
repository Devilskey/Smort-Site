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



export const NavBarSmortPc = (props:props):JSX.Element => {

  let InstallPromptEvent : any;
  const user = smort.getUser();
  const [search, setSearch] = useState<string>("");

  useEffect(()=> {
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


            <Navbar.Toggle aria-controls="basic-navbar-nav" className={Style.collapse} >
              <span className="navbar-toggler-icon" ></span> {/* Custom color */}

            </Navbar.Toggle>

            <Navbar.Collapse className="justify-content-end" >

              <div className={Style.SearchBarDiv}>
                <input type="text" className={Style.SearchBarText}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    props.Search( event.target.value )
                  }} />

                <button className={Style.SearchButton} onClick={() => {
                  props.Search(search);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </button>
              </div>

              <Nav className="">

                <Nav.Link as={Link} to={"/account"}>
                  {user !== undefined ? (
                    <div className={Style.User}>
                      <div className={Style.UserText}> {user?.username}</div>
                      <img

                        src={smort.GetImageUrl(user?.profile_Picture)}
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
                  <div className={Style.WhiteTekst}  onClick={()=>{
                     InstallPromptEvent.prompt();
                  }}>
                      Install App
                  </div>
                }

            </Navbar.Collapse >
          </Container>
        </Navbar >
      </>
    )
  }