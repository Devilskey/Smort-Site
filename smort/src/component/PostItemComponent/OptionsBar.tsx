import { useState } from "react";
import { ContentItem } from "../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../Api/smortApi";
import Style from './OptionsBar.module.scss'
import { LikedIcon, LikeIcon } from "../../core/Icon";


export const OptionsButtons = ({ post }: { post: ContentItem }) => {
  const [localPost, setLocalPost] = useState(post);

  return (<div className={Style.Options} id={`Options-${post.id}`}>
    {smort.getUser() !== undefined ? <>
    <button className={Style.LikeButton} onClick={() => {
      smort.likeContent(localPost.id, localPost.type).then(value => {
        if (value !== "") {
          setLocalPost(prevPost => ({
            ...prevPost,
            likes: value === "RemoveLike" ? prevPost.likes - 1 : prevPost.likes + 1,
            alreadyLiked: value === "RemoveLike" ? 0 : 1,
          }));
        }
      });
    }}>
      {localPost.alreadyLiked !== 0 ? (<div className={Style.LikedColor}>  <LikedIcon /> {localPost.likes}</div>) : (<div><LikeIcon />  {localPost.likes} </div>)}
    </button>
    </> :
      <div className={Style.LikeAmountText}><LikeIcon /> {`${localPost.likes}`}  </div>
    }
  </div>);
}