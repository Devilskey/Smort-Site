import React from "react"
import { Video } from "../../Api/ApiObjects/VideoObject"

import { smortApi as smort } from "../../Api/smortApi"
import Style from './VideoItems.module.scss'

import logo from '../../SiteAssets/Smort_Logo.png'
import { Link } from "react-router-dom"
import { PostImage } from "../../Api/ApiObjects/PostImageObjects"
import { Button } from "react-bootstrap"

interface ContentProps {
  VideoList: Video[]
  PostImage: PostImage[]
  ShowTypeOfContent: string
}


export default class ContentItemsRender extends React.Component<ContentProps> {


  render() {
    return (<div className={Style.content}>
      {this.props.ShowTypeOfContent === "Video" ?
        (<>
          <VideoList videos={this.props.VideoList} />
        </>
        ) : (
        <>
          <ImageList images={this.props.PostImage} />
        </>
        )}
    </div>)
  }
}

const ImageList =  ({ images }: { images: PostImage[] }): JSX.Element => {
  console.log("images:", images);
  return (<>
    {images.map((image) => (

      <div className={Style.contentItem}>
        <div className={Style.UserSimpel}>

          <Link to={`/account/${image.User_Id}`}>
            <img className={Style.UserImgSimpel}
              src={image.User_Id !== undefined ? smort.GetProfilePictureImageUrl(image.User_Id) : logo} />
            {image.Username}
          </Link>

        </div>
        <p>
          <h3 className={Style.contentTitle}>{image.Title}</h3>
          <div className={Style.contentDescription}>{image.Description}</div></p>
          <img className={Style.ContentImg} src={smort.GetImageUrl(image.File_Id)}></img>
      </div>
    ))}</>)
  }

const VideoList = ({ videos }: { videos: Video[] }): JSX.Element => {
  return (<>
    {videos.map((video) => (

      <div className={Style.contentItem}>
        <div className={Style.UserSimpel}>

          <Link to={`/account/${video.User_Id}`}>
            <img className={Style.UserImgSimpel}
              src={video.User_Id !== undefined ? smort.GetProfilePictureImageUrl(video.User_Id) : logo} />
            {video.Username}
          </Link>

        </div>
        <p>
          <h3 className={Style.contentTitle}>{video.Title}</h3>
          <div className={Style.contentDescription}>{video.Description}</div></p>
        <video src={smort.GetVideoUrl(video.Id)} loop onClick={(event) => {
          const videoElement = event.currentTarget;
          if (videoElement.paused) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        }} />
      </div>
    ))}</>)
}