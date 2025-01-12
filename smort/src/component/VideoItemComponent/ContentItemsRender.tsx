import React, { useState } from "react"
import { Video } from "../../Api/ApiObjects/VideoObject"

import { smortApi as smort } from "../../Api/smortApi"
import Style from './Contenttems.module.scss'

import logo from '../../SiteAssets/Smort_Logo.png'
import { Link } from "react-router-dom"
import { PostImage } from "../../Api/ApiObjects/PostImageObjects"
import { Post } from "../../Api/ApiObjects/PostObject"

interface ContentProps {
  postsList:Post[]
}


export default class ContentItemsRender extends React.Component<ContentProps> {


  render() {
    return (<div className={Style.content}>
        <>
          <PostList posts={this.props.postsList} />
        </>
    </div>)
  }
}

const PostList = ({ posts }: { posts: Post[] }): JSX.Element => {
  const [reload, setReload] = useState(0);
  return (<>
    {posts.map((post) => (

      <div className={Style.contentItem}>
        <div className={Style.UserSimpel}>

          <Link to={`/account/${post.User_Id}`}>
            <img className={Style.UserImgSimpel}
              loading="lazy"
              src={post.User_Id !== undefined ? smort.GetProfilePictureImageUrl(post.User_Id) : logo} />
            {post.Username}
          </Link>

        </div>
        <p>
          <h3 className={Style.contentTitle}>{post.Title}</h3>
          <div className={Style.contentDescription}>{post.Description}</div></p>

        {post.Type === "vid" ? 
           <div className={Style.VideoContainer}>
           <video src={smort.GetVideoUrl(post.Id)} loop onClick={(event) => {
             const videoElement = event.currentTarget;
             if (videoElement.paused) {
               videoElement.play();
             } else {
               videoElement.pause();
             }
           }} />
         </div>
        :
        <img className={Style.ContentImg}
          loading="lazy"
          src={smort.GetImageUrl(post.File_Id)}></img>
        }


        <div className={Style.Options}>
          {smort.getUser() !== undefined ? <><button className={Style.LikeButton} onClick={() => {
            smort.likeContent(post.Id, post.Type).then(value => {
              if (value !== "") {
                if (value === "RemoveLike") {
                  post.Likes -= 1;
                  post.AlreadyLiked = 0;

                } else if (value === "Like") {
                  post.Likes += 1;
                  post.AlreadyLiked = 1;

                }
                setReload((reload + 1))
              }
            });
          }}>{post.AlreadyLiked !== 0 ? (<>UnLike</>) : (<>Like</>)}</button>
            <h1>  {post.Likes} </h1>
          </> : <h1>{`Likes:  ${post.Likes}`}</h1>}

        </div>
      </div>
    ))}</>)
}