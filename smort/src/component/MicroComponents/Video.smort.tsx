import { useRef, useState } from "react";
import { ContentItem } from "../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../Api/smortApi";
import { OptionsButtons } from "../PostItemComponent/OptionsBar";
import Style from "./Video.module.scss"
import { PlayIcon } from "../../core/Icon";
import { Video } from "../../core/ImprovedControls/Video";

interface props {
    content: ContentItem
}

export const SmortVideo = (props: props) => {
    const [playState, setPlayState] = useState(false)
    const videoRef = useRef(null);

    const toggleVideo = () => {
        const video = videoRef.current as any;

        if (!video) return;

        if (video.paused) {
            video.play();
            setPlayState(true);
        } else {
            video.pause();
            setPlayState(false);
        }
    };


    
    return <div className={Style.VideoContainer}>
        <Video  
        ref={videoRef}
        className={Style.PleasePlayMe} 
        src={smort.GetVideoUrl(props.content.id)} 
        loop 
        onClick={(event:any) => {
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
            <div className={Style.PlayButton} onClick={toggleVideo}>
                <PlayIcon/>
            </div>
        }
    </div>
}