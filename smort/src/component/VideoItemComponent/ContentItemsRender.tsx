import React, { useState } from "react"

import { smortApi as smort } from "../../Api/smortApi"
import Style from './Contenttems.module.scss'

import logo from '../../SiteAssets/Smort_Logo.png'
import { Link } from "react-router-dom"
import { ContentItem } from "../../Api/ApiObjects/ContentObject"
import { LikedIcon, LikeIcon } from "../../icons/Interections.icon"
import { OptionsButtons } from "./OptionsBar"
import { SmortVideo } from "../MicroComponents/Video.smort"

interface ContentProps {
  postsList: ContentItem[]
}




export const PostList = ({ posts, loading }: { posts: ContentItem[], loading: boolean }): JSX.Element => {
  return (<>
    {loading ? <p>loading</p> :
      <div className={Style.content}>
        {posts.map((post, idx) => (

          <div className={Style.contentItem} key={idx}>
            <div className={Style.TextBased}>
              <div className={Style.UserSimpel}>

                <Link to={`/account/${post.User_Id}`}>
                  <img className={Style.UserImgSimpel}
                    loading="lazy"
                    src={post.User_Id !== undefined ? smort.GetProfilePictureImageUrl(post.User_Id) : logo} />
                  {post.Username}
                </Link>

              </div>

              <div className={Style.contentTitle}>{post.Description}</div>
            </div>

            {post.Type === "vid" ?
              <div className={Style.VideoContainer}>
                <SmortVideo content={post} />

              </div>
              :
              <div className={Style.ContentImg}>
                <img
                  loading="lazy"
                  src={smort.GetImageUrl(post.File_Id)}>
                </img>
                <OptionsButtons post={post} />
              </div>
            }
          </div>
        ))}
      </div>
}
  </>)
}
