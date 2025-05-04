import React, { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";
import { ContentItem } from "../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../Api/smortApi";
import Style from "./ShowContentFullScreen.module.scss"
import { OptionsButtons } from "../VideoItemComponent/OptionsBar";
import { SmortVideo } from "../MicroComponents/Video.smort";

interface props {
}


export type ShowContentFullScreenHandle = {
	toggleModal: (ContentId: number) => void;
}

export const ShowContentFullScreen = forwardRef<ShowContentFullScreenHandle>(({ }, ref) => {
	const [Show, setShow] = useState<boolean>(false);
	const [ContentItem, setContentItem] = useState<ContentItem[]>([]);

	useImperativeHandle(ref, () => ({
		toggleModal,
	}));


	const toggleModal = (ContentId: number = -1) => {
		if (ContentId !== -1) {
			console.log(ContentId);
			smort.GetContentItemAsync(ContentId.toString()).then((item) => {
				setContentItem(item);
				setShow(Show);
			}).catch(console.error)
		} else {
			setShow(false);

		}

	};


	return <>
		<Modal show={Show} centered size="lg">
			<Modal.Header>

				<button onClick={() => toggleModal()}>
					back
				</button>

			</Modal.Header>

			<Modal.Body>

				{ContentItem.length > 0 &&
					ContentItem[0].Type === "img" ?
					<div>
						<img
							loading="lazy"
							src={smort.GetImageUrl(ContentItem[0].File_Id)}
							className={Style.ImgContent} />
						<OptionsButtons post={ContentItem[0]} />
					</div>
					:
					<div className={Style.VideoContainer}>
						<SmortVideo content={ContentItem[0]} />

					</div>
				}


			</Modal.Body>
		</Modal>
	</>
});
