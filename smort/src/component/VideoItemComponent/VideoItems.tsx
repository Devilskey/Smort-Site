import React from "react"
import { Video } from "../../Api/ApiObjects/VideoObject"

import { smortApi as smort } from "../../Api/smortApi"
import Style from './VideoItems.module.scss'
import { Container } from "react-bootstrap"

import logo from '../../SiteAssets/Smort_Logo.png'
import { Link } from "react-router-dom"

interface VideoProps {
  VideoList: Video[]
}

export default class VideoItemsRender extends React.Component<VideoProps> {

  render() {
    return (<div className={Style.Video}>
      {this.props.VideoList.map((video) => (
        <div className={Style.VideoItem}>
          <div className={Style.UserSimpel}>
            <Link to={`/account/${video.User_Id}`}>
              <img className={Style.UserImgSimpel}
                src={video.User_Id !== undefined ? smort.GetProfilePictureImageUrl(video.User_Id) : logo} />
              {video.Username}
            </Link>
          </div>
          <p>
            <h3>{video.Title}</h3>
            {video.Description}</p>
          <video src={smort.GetVideoUrl(video.Id)} loop onClick={(event) => {
            const videoElement = event.currentTarget; // Get the video element from the event

            if (videoElement.paused) {
              videoElement.play(); // Play the video if it's currently paused
            } else {
              videoElement.pause(); // Pause the video if it's currently playing
            }
          }} />
        </div>
      ))}
    </div>)

  }
}