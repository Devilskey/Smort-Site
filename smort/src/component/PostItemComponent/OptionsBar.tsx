import { useState } from "react";
import { ContentItem } from "../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../Api/smortApi";
import Style from './OptionsBar.module.scss'
import { LikedIcon, LikeIcon } from "../../core/Icon";


export const OptionsButtons = ({ post }: { post: ContentItem }) => {
  const [reload, setReload] = useState(0);
  const [localPost, setLocalPost] = useState(post);

  return (<div className={Style.Options}>
    {smort.getUser() !== undefined ? <><button className={Style.LikeButton} onClick={() => {
      smort.likeContent(localPost.Id, localPost.Type).then(value => {
        if (value !== "") {
          setLocalPost(prevPost => ({
            ...prevPost,
            Likes: value === "RemoveLike" ? prevPost.Likes - 1 : prevPost.Likes + 1,
            AlreadyLiked: value === "RemoveLike" ? 0 : 1
          }));
          setReload((reload + 1))
        }
      });
    }}>
      {localPost.AlreadyLiked !== 0 ? (<div className={Style.LikedColor}>  <LikedIcon /> {localPost.Likes}</div>) : (<div><LikeIcon />  {localPost.Likes} </div>)}
    </button>
    </> :
      <div className={Style.LikeAmountText}><LikeIcon /> {`${localPost.Likes}`}  </div>
    }

  </div>);
}