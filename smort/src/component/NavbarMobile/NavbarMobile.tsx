import React, {
	useEffect,
	useRef,
	useState,
	MutableRefObject,
  } from "react";
  import { Container, Navbar } from "react-bootstrap";
  import { Link, useLocation, useNavigate } from "react-router-dom";
  import Style from "./NavbarMobile.module.scss"; 
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { smortApi as smort } from "../../Api/smortApi";
import { UploadContentModal, UploadContentModalHandle } from "../Modals/UploadContent/UploadContent.Modal";
import { HomeIcon, InboxIcon, PlusIcon, SearchIcon } from "../../core/Icon";
import { Img } from "../../core/ImprovedControls/Img";
import { useTranslation } from "../../translations/TranslationProvider";
  
  type Props = {
	Search: (value: string) => void;
  };
  
  export const NavBarSmortMobile: React.FC<Props> = ({ Search }) => {
	const [SearchBarDisplayState, setSearchBarDisplayState] = useState(false);
	const [alreadyInstalled, setAlreadyInstalled] = useState(false);
  
	const UploadContentComponent = useRef<UploadContentModalHandle>(null);
	const InstallPromptEventRef = useRef<any>(null);

	const { t } = useTranslation();

  	const navigate = useNavigate();
  	const location = useLocation();
	
  
	useEffect(() => {
	  const handler = (event: any) => {
		event.preventDefault();
		InstallPromptEventRef.current = event;
  
		const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
		setAlreadyInstalled(isInstalled);
	  };
  
	  window.addEventListener("beforeinstallprompt", handler);
  
	  return () => {
		window.removeEventListener("beforeinstallprompt", handler);
	  };
	}, []);
  
	const GetVisibility = () => (SearchBarDisplayState ? "flex" : "none");
  
	const user = smort.getUser();
  
	return (
	  <div className={Style.Nav}>
		<UploadContentModal ref={UploadContentComponent} />
  
		  <Container>
			<input
			  type="text"
			  className={`${Style.SearchBarText}`}
			  style={{ display: GetVisibility() }}
			  onChange={(event) => {
				const value = event.target.value;
				Search(value);
			  }}
			/>
			
		  </Container>
		  
  
		  <Container className={Style.NavItems}>
			<Link className={location.pathname === "/home" ? Style.NavButtonActive : Style.NavButton} to={"/home"}>
			  {/* Home icon */}
			  <HomeIcon/>
			  <div>{t("mobileNavbar.home")}</div>

			</Link>

			<button
			  className={Style.NavButton }
			  onClick={() => {
				setSearchBarDisplayState(!SearchBarDisplayState);
				if(!SearchBarDisplayState){
					console.log("navigating to home")
					navigate('/home')
				}
			  }}>
			  <SearchIcon/>
			  <div>{t("mobileNavbar.search")}</div>
			</button>

			
			<button
			  className={Style.NavButtonUpload}
			  onClick={() => {
				UploadContentComponent.current?.toggleModal();
			  }}>
			  <PlusIcon/>
			</button>
			
  			<button
			  className={Style.NavButton }
			  onClick={() => {
				setSearchBarDisplayState(!SearchBarDisplayState);
				if(!SearchBarDisplayState){
					console.log("navigating to home")
					navigate('/home')
				}
			  }}>
			  <InboxIcon/>
			  <div>{t("mobileNavbar.notify")}</div>
			</button>


  
	
  
			<Link to={"/account"} className={location.pathname === "/account" ? Style.NavButtonActive : Style.NavButton}>
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