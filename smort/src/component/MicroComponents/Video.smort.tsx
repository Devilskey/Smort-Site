import { useState } from "react";
import { ContentItem } from "../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../Api/smortApi";
import { OptionsButtons } from "../VideoItemComponent/OptionsBar";
import Style from "./Video.module.scss"

interface props {
    content: ContentItem
}

export const SmortVideo = (props: props) => {
    const [playState, setPlayState] = useState(false)

    return <>
        <video className={Style.PleasePlayMe} src={smort.GetVideoUrl(props.content.Id)} loop onClick={(event) => {
            const videoElement = event.currentTarget;
            if (videoElement.paused) {
                videoElement.play();
                setPlayState(true)
            } else {
                videoElement.pause();
                setPlayState(false)
            }

        }}
        />
        { !playState &&
            <div className={Style.PlayButton}>
                <svg width="70" height="70" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm8.856-3.845A1.25 1.25 0 0 0 9 9.248v5.504a1.25 1.25 0 0 0 1.856 1.093l5.757-3.189a.75.75 0 0 0 0-1.312l-5.757-3.189Z" fill="#ffffff" /></svg>
            </div>
        }
        <OptionsButtons post={props.content} />
    </>
}