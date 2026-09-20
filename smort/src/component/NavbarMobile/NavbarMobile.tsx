import React, {
	useEffect,
	useRef,
  } from "react";
  import { Container } from "react-bootstrap";
  import { Link, useLocation } from "react-router-dom";
  import Style from "./NavbarMobile.module.scss"; 
import { smortApi as smort } from "../../Api/smortApi";
import { UploadContentModal, UploadContentModalHandle } from "../Modals/UploadContent/UploadContent.Modal";
import { HomeIcon, InboxIcon, PlusIcon, SearchIcon } from "../../core/Icon";
import { Img } from "../../core/ImprovedControls/Img";
import { useTranslation } from "../../translations/TranslationProvider";
  
  type Props = {
	Search: (value: string) => void;
  };
  
  export const NavBarSmortMobile: React.FC<Props> = ({ Search }) => {
  
	const UploadContentComponent = useRef<UploadContentModalHandle>(null);
	const InstallPromptEventRef = useRef<any>(null);

	const { t } = useTranslation();

  	const location = useLocation();
	
  
	useEffect(() => {
	  const handler = (event: any) => {
		event.preventDefault();
		InstallPromptEventRef.current = event;
  	  };
  
	  window.addEventListener("beforeinstallprompt", handler);
  
	  return () => {
		window.removeEventListener("beforeinstallprompt", handler);
	  };
	}, []);
  
  
	const user = smort.getUser();
  
	return (
	  <div className={Style.Nav}>
		<UploadContentModal ref={UploadContentComponent} />

  
		  <Container className={Style.NavItems}>
			<Link className={location.pathname.toLowerCase() === "/home" ? Style.NavButtonActive : Style.NavButton} to={"/home"}>
			  {/* Home icon */}
			  <HomeIcon/>
			  <div>{t("mobileNavbar.home")}</div>

			</Link>

			<Link to='/search'
			  className={location.pathname.toLowerCase() === "/search" ? Style.NavButtonActive : Style.NavButton}>
			  <SearchIcon/>
			  <div>{t("mobileNavbar.search")}</div>
			</Link>

			
			<button
			  className={Style.NavButtonUpload}
			  onClick={() => {
				UploadContentComponent.current?.toggleModal();
			  }}>
			  <PlusIcon/>
			</button>
			
  			<Link to='/inbox'
			  className={location.pathname.toLowerCase() === "/inbox" ? Style.NavButtonActive : Style.NavButton}>
			  <InboxIcon/>
			  <div>{t("mobileNavbar.notify")}</div>
			</Link>


  
			<Link to={"/account"} className={location.pathname.toLowerCase() === "/account" ? Style.NavButtonActive : Style.NavButton}>
			  <div className={Style.User}>
				<Img
				  src={smort.GetImageUrl(user?.profilePicture, false)}
				  width="40"
				  height="40"
				  className={Style.UserImg}
				  alt=""
				/>
			  </div>
			  <div>{t("mobileNavbar.profile")}</div>

			</Link>
		  </Container>
	  </div>
	);
  };