import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { IMyProfile } from "../../Api/ApiObjects/userObjects"
import React, { createRef } from "react"
import { smortApi as smort } from "../../Api/smortApi"
import Style from './NavbarMobile.module.scss';
import logo from '../../SiteAssets/Smort_Logo.png';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";

interface props {
	Search: (search: string) => void;
}

interface state {
	search: string;
	SearchBarDisplayState: boolean;
	alreadyInstalled: boolean;

}


export class NavBarSmortMobile extends React.Component<props, state> {

	public InstallPromptEvent: any = null;

	constructor(props: props) {
		super(props);

		this.state = {
			search: "",
			SearchBarDisplayState: false,
			alreadyInstalled: false
		}

		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			this.InstallPromptEvent = event;
			console.log(event)
			const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

			this.setState({ alreadyInstalled: isInstalled })
		})

		
	}

	public GetVisibility() {
		return this.state.SearchBarDisplayState ? "flex" : "none";
	}

	render() {

		const user = smort.getUser();

		console.log("USer nav", user)
		

		return (
			<div className={Style.Nav}>
				<Navbar expand="lg" >
					<Container>

						<input type="text" className={`${Style.SearchBarText}`} style={{ display: this.GetVisibility() }}
							onChange={(event) => {
								this.setState({ search: event.target.value })
								this.props.Search(this.state.search);
							}} />

					</Container>
					<Container className={Style.NavItems}>

						<Link className={Style.NavButton} to={"/Home"} >
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
								<path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
							</svg>
						</Link>

						<Link to={"/UploadContent"} className={Style.NavButton}>
							<div className={Style.User} >
								<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
									<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
								</svg>
							</div>
						</Link>

						<button className={Style.NavButton} onClick={() => {
							this.setState({ SearchBarDisplayState: !this.state.SearchBarDisplayState })
							console.log(this.state.SearchBarDisplayState)
						}}>
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
								<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
							</svg>
						</button>

						{AndroidHandler.IsUsingAndroid() && AndroidHandler.PWArunning() === false &&
							<div className={Style.NavButton} onClick={() => {
								this.InstallPromptEvent.prompt();
							}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
									<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
									<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
								</svg>
							</div>
						}

						<Link to={"/account"} className={Style.NavButton}>
							<div className={Style.User} >
								<img
									src={smort.GetImageUrl(user?.profile_Picture)}
									width="60"
									height="60"
									className={Style.UserImg}
									alt="" />
							</div>
						</Link>


					</Container>
				</Navbar >
			</div>
		)
	}
}