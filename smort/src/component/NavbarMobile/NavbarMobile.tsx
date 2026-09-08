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
import { HomeIcon, PlusIcon, SearchIcon } from "../../core/Icon";
import { Img } from "../../core/ImprovedControls/Img";
  
  type Props = {
	Search: (value: string) => void;
  };
  
  export const NavBarSmortMobile: React.FC<Props> = ({ Search }) => {
	const [SearchBarDisplayState, setSearchBarDisplayState] = useState(false);
	const [alreadyInstalled, setAlreadyInstalled] = useState(false);
  
	const UploadContentComponent = useRef<UploadContentModalHandle>(null);
	const InstallPromptEventRef = useRef<any>(null);

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
  
		<Navbar expand="lg">
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
			</Link>

			{AndroidHandler.IsUsingAndroid() && !AndroidHandler.PWArunning() && (
			  <div
				className={Style.NavButton}
				onClick={() => {
				  InstallPromptEventRef.current?.prompt();
				}}
			  >
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
				  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
				  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
				</svg>
			  </div>
			)} 
  
			<button
			  className={Style.NavButtonUpload}
			  onClick={() => {
				UploadContentComponent.current?.toggleModal();
			  }}
			>
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
			  }}
			>
			  <SearchIcon/>
			</button>
  
	
  
			<Link to={"/account"} className={location.pathname === "/account" ? Style.NavButtonActive : Style.NavButton}>
			  <div className={Style.User}>
				<Img
				  src={smort.GetImageUrl(user?.profilePicture, false)}
				  width="60"
				  height="60"
				  className={Style.UserImg}
				  alt=""
				/>
			  </div>
			</Link>
		  </Container>
		</Navbar>
	  </div>
	);
  };