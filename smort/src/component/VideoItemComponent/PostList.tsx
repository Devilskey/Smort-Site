
import { smortApi as smort } from "../../Api/smortApi"
import Style from './PostList.module.scss'
import { Link } from "react-router-dom"
import { ContentItem } from "../../Api/ApiObjects/ContentObject"
import { OptionsButtons } from "./OptionsBar"
import { SmortVideo } from "../MicroComponents/Video.smort"
import { size } from "../../Api/enums/sizes"

interface ContentProps {
  postsList: ContentItem[]
}

export const PostList = ({ posts, loading }: { posts: ContentItem[], loading: boolean }): JSX.Element => {
  return (<>
    {loading ? <p>loading</p> :
      <div className={Style.content}>
        {posts.map((post, idx) => (
          <div className={Style.contentItem} key={idx}>
            <div className={Style.User}>
                <Link to={`/account/${post.User_Id}`} 
                className={Style.UserLink}>
                  <img className={Style.UserImgSimpel}
                    rel="preload"
                    alt="An image Uploaded to smort"
                    width="40px" height="40px"
                    srcSet={`
                      ${smort.GetProfilePictureImageUrl(post.User_Id)}&size=${size.L} 1000w,
                      ${smort.GetProfilePictureImageUrl(post.User_Id)}&size=${size.M} 720w,
                      ${smort.GetProfilePictureImageUrl(post.User_Id)}&size=${size.S} 480w`}/>
                  {post.Username}
                </Link>
              <div className={Style.contentTitle}>{post.Description}</div>
            </div>

            {post.Type === "vid" ?
              <div className={Style.VideoContainer}>
                <SmortVideo content={post} />

              </div>
              :
              <div className={Style.ContentImg}>
                <img
                  rel="preload"
                  alt="An image Uploaded to smort"
                  srcSet={`
                    ${smort.GetImageUrl(post.File_Id)}&size=${size.L} 1000w,
                    ${smort.GetImageUrl(post.File_Id)}&size=${size.M} 720w,
                    ${smort.GetImageUrl(post.File_Id)}&size=${size.S} 480w`}
                  sizes="width: 100%"/>
                <OptionsButtons post={post} />
              </div>
            }
          </div>
        ))}
      </div>
    }
  </>)
}
