
import { ReactElement, useEffect, useRef, useState } from "react"
import { smortApi as smort } from "../Api/smortApi"
import { Link } from "react-router-dom"
import { IMyProfile } from "../Api/ApiObjects/userObjects";
import { NavBarSmortPc } from "../component/NavbarPc";
import { Container } from "react-bootstrap";
import Style from './HomePage.module.scss';
import { PostList } from "../component/PostItemComponent/PostList";
import { ContentItem } from "../Api/ApiObjects/ContentObject";
import { AndroidHandler } from "../PlatformSpecificScripts/Android";
import { NavBarSmortMobile } from "../component/NavbarMobile/NavbarMobile";
import { FollowingUser } from "../Api/ApiObjects/FollowingObjects";
import { handleDragScroll } from "../core/DragScroll";
import { size } from "../Api/enums/sizes";


export const HomePage = (): ReactElement => {
  const [user, setUser] = useState<IMyProfile>();

  const [ContentList, SetContentList] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [following, setfollowing] = useState<FollowingUser[]>([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (smort.getUser() === undefined) {
      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => console.error("Failed to fetch profile:", error));

      smort.GetMostFollowed().then((mostFollowed: FollowingUser[]) => {
        setfollowing(mostFollowed);
      });
    } else {
      smort.GetFollowingAccounts().then((following: FollowingUser[]) => {
        if (following.length !== 0) {
          setfollowing(following);
        } else {
          smort.GetMostFollowed().then((mostFollowed: FollowingUser[]) => {
            setfollowing(mostFollowed);
          });
        }

      });
    }
  }, []);

  useEffect(() => {
    smort.GetContentList(search).then((result: ContentItem[]) => {
      console.log(result)
      SetContentList(result)
    })
  }, [search]);

  return (
    <>
      <div className={Style.Page}>
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={(test: string) => { setSearch(test) }} />
        }

        <Container className={Style.HomeFeed}>
          <div className={Style.Scroll}>

            <div className={Style.FollowingsMenu}>
              <div className={Style.Followings} ref={scrollRef} onDrag={() => handleDragScroll(scrollRef)}>
                {following.map((follow) => (
                  <Link className={Style.FollowItem} to={`/account/${follow.User_Id_Followed}`} draggable="false">
                    <img width="100" height="100" 
                    alt="PFpUserSmorthub"
                    src={`${smort.GetImageUrl(follow.Profile_Picture, false)}&size=${size.S}`} 
                    srcSet={`
                      ${smort.GetImageUrl(follow.Profile_Picture, false)}&size=${size.L} 1000w,
                      ${smort.GetImageUrl(follow.Profile_Picture, false)}&size=${size.M} 720w,
                    	${smort.GetImageUrl(follow.Profile_Picture, false)}&size=${size.S} 480w`}
                    draggable="false" />
                  </Link>
                ))}
              </div>
            </div>

            <PostList posts={ContentList} loading={ContentList.length === 0} />
          </div>
        </Container>

        {AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={(test: string) => { setSearch(test) }} />
        }
      </div>

    </>
  )
}

