
import { smortApi as smort } from "../../Api/smortApi"
import Style from './PostList.module.scss'
import { Link } from "react-router-dom"
import { ContentItem } from "../../Api/ApiObjects/ContentObject"
import { OptionsButtons } from "./OptionsBar"
import { SmortVideo } from "../MicroComponents/Video.smort"
import { size } from "../../Api/enums/sizes"
import { AskQuestion } from "../PostTypes/AskQuestion/AskQuestion"
import { ReactElement } from "react"

interface ContentProps {
  postsList: ContentItem[]
}

export const PostList = ({ posts, loading }: { posts: ContentItem[], loading: boolean }): ReactElement => {



  console.log()
  return (<>
    {loading ? <p>loading</p> :
      <div className={Style.content}>
        {posts.map((post, idx) => (
          <div className={Style.contentItem} key={idx}>
            <div className={Style.User}>
              <Link to={`/account/${post.User_Id}`}
                className={Style.UserLink}>
                <img className={Style.UserImgSimpel}
                  loading="lazy"
                  alt="An image Uploaded to smort"
                  width="40px" height="40px"
                  src={`${smort.GetProfilePictureImageUrl(post.User_Id)}&size=${size.S}`} />
                {post.Username}
              </Link>
              <div className={Style.contentTitle}>{post.Description}</div>
            </div>

            {post.Type === "vid" &&
              <div className={Style.VideoContainer}>
                <SmortVideo content={post} />

              </div>}
            {post.Type === "img" &&
              <div className={Style.ContentImg}>
                <img
                  loading="lazy"
                  alt="An image Uploaded to smort"
                  srcSet={`
                    ${smort.GetImageUrl(post.File_Id)}&size=${size.M}`}
                  sizes="width: 100%" />
              </div>
            }

            {post.Type === "Ask" &&
              <>
              <AskQuestion post={post}/>
              </>
            }
            <OptionsButtons post={post} />

          </div>
        ))}
      </div>
    }
  </>)
}
