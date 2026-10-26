import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { IMyProfile } from "../Api/ApiObjects/userObjects"
import React, { ReactElement, useEffect, useRef, useState } from "react"
import { smortApi as smort } from "../Api/smortApi"
import Style from './Navbar.module.scss';
import logo from '../SiteAssets/NotificationIcon-192x192.png';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AndroidHandler } from "../PlatformSpecificScripts/Android";
import { useTranslation } from "../translations/TranslationProvider";
import { Img } from "../core/ImprovedControls/Img";
import { NotificationBellIcon, PlusIcon, SearchIcon } from "../core/Icon";
import { UploadContentModal, UploadContentModalHandle } from "./Modals/UploadContent/UploadContent.Modal";
import { signOut } from "firebase/auth";
import { auth } from "../configs/FirebaseConfig";



export const NavBarSmortPc = (): ReactElement => {
  const UploadContentComponent = useRef<UploadContentModalHandle>(null);

  let InstallPromptEvent: any;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = smort.getUser();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      InstallPromptEvent = event;
    })
  }, [])

  const logout = async () => {
    await signOut(auth);
    window.location.reload();
  }

  return (
    <>
      <UploadContentModal ref={UploadContentComponent} />

      <Navbar expand="lg" className={Style.Nav}>
        <Container>
          <Navbar.Brand as={Link} to="/home"><Img
            src={logo}
            width="60"
            height="60"
            className={Style.Logo}
            alt="React Bootstrap logo"
          /> </Navbar.Brand>


          <Nav >
            <Nav.Link
              className={Style.IconNav}
              to={"/search"} as={Link}>
              <SearchIcon />
            </Nav.Link>

            <Nav.Link as={Link} to={"/inbox"} className={Style.IconNav}>
              <NotificationBellIcon />
            </Nav.Link>

            <Nav.Link
              className={Style.NavButtonUpload}
              onClick={() => {
                UploadContentComponent.current?.toggleModal();
              }}>
              <PlusIcon />
            </Nav.Link>

            <NavDropdown className={Style.UserNav} title={user !== undefined ? (
              <>{user !== undefined ? (
                <div className={Style.User}>
                  <div className={Style.UserText}> {user?.username}</div>
                  <Img
                    src={smort.GetImageUrl(user?.profilePicture, false)}
                    width="60"
                    height="60"
                    className={Style.UserImg}
                    alt="" />
                </div>) :
                (<div className={Style.WhiteTekst}>
                  {t('navbar.loginCreateAccount')}
                </div>)
              }</>) : (<></>)}  >
              <NavDropdown.Item onClick={() => { navigate("/account") }}>Account</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {AndroidHandler.IsUsingAndroid() &&
            <div className={Style.WhiteTekst} onClick={() => {
              InstallPromptEvent.prompt();
            }}>
              {t('navbar.installApp')}
            </div>
          }

        </Container>
      </Navbar >
    </>
  )
}