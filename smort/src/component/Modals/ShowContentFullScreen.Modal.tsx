import React from "react";
import { Modal } from "react-bootstrap";
import { ContentItem } from "../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../Api/smortApi";
import Style from "./ShowContentFullScreen.module.scss"
import { OptionsButtons } from "../VideoItemComponent/OptionsBar";
import { SmortVideo } from "../MicroComponents/Video.smort";

interface props {
}

interface state {
	Show: boolean
	ContentItem: ContentItem[]
}

export class ShowContentFullScreen extends React.Component<props, state> {

	constructor(props: props) {
		super(props)

		this.state = {
			Show: false,
			ContentItem: []
		}
	}

	toggleModal = (ContentId: number = -1) => {
		if (ContentId !== -1) {
			console.log(ContentId);
			smort.GetContentItemAsync(ContentId.toString()).then((item) => {
				this.setState({ ContentItem: item })
				this.setState({ Show: true });
			}).catch(console.error)
		}else{
			this.setState({ Show: false });

		}

	};


	public render(): React.ReactNode {
		return <>
			<Modal show={this.state.Show} centered size="lg">
				<Modal.Header>

					<button onClick={() => this.toggleModal()}>
						back
					</button>

				</Modal.Header>

				<Modal.Body>

					{this.state.ContentItem.length > 0 &&
						this.state.ContentItem[0].Type === "img" ?
						<div>
							<img
								loading="lazy"
								src={smort.GetImageUrl(this.state.ContentItem[0].File_Id)}
								className={Style.ImgContent} />
							<OptionsButtons post={this.state.ContentItem[0]}/>
						</div>
						:
						<div className={Style.VideoContainer}>
							<SmortVideo content={this.state.ContentItem[0]}/>

						</div>
					}


				</Modal.Body>
			</Modal>
		</>
	}
}