
import React, { JSX, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Container } from "react-bootstrap";

import { smortApi as smort } from "../../Api/smortApi";
import { IMyProfile } from "../../Api/ApiObjects/userObjects";
import { NavBarSmort } from "../../component/Navbar";

import Style from "./AccountPage.module.scss";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import ContentManegmentComponent from "../../component/ThumbnailComponent/ContentManegmentComponent";


export const AccountPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IMyProfile>();
  const [search, SetSearch] = useState<string>("");
  const { id } = useParams()
  const [VideoList, SetVideoList] = useState<ThumbnailObject[] | null>(null);
  const [Follower, setFollower] = useState<boolean>(false);
  const [FollowerAmmount, setFollowerAmmount] = useState<string | null>(null);
  const AccountContent = useRef();

  useEffect(() => {
    // Fetch user profile only once
    if (smort.getUser() === undefined && id === undefined) {
      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => console.error("Failed to fetch profile:", error));
    } else if (id !== undefined) {
      smort.GetProfileAsync(Number(id))
        .then((profile: any) => {

          setUser(profile)
        })
        .catch((error) => console.error("Failed to fetch profile:", error));
    } else {

      setUser(smort.getUser())
    }

    console.log(id)
    if (id !== undefined) {
      smort.GetUsersContent(Number(id)).then((data: ThumbnailObject[]) => {
        console.log(data);
        SetVideoList(data);
      })
      smort.GetFollowersAsync(id).then((FollowerAmmount: string) => {
        setFollowerAmmount(FollowerAmmount)
      })

      smort.AlreadyFollowing(id).then((FollowerAlready: boolean) => {
        setFollower(FollowerAlready);
      })

    }
    else {

      smort.GetMyContent().then((data: ThumbnailObject[]) => {
        console.log(data);
        SetVideoList(data);
      })
      smort.GetMyFollowersAsync().then((FollowerAmmount: string) => {
        setFollowerAmmount(FollowerAmmount)
      })
    }
  }, []);


  return (
    <>
      <div className={Style.Page}>
        <NavBarSmort />
        <div className={Style.UserInfoBackground}>
          <div className={Style.UserDataComplete}>
            <div >
              {user ? (
                <div className={Style.UserImgSpace}>
                  <img
                    src={smort.GetImageUrl(user.profile_Picture)}
                    alt="User profile"
                    className={Style.UserImg}
                  />
                </div>
              ) : (<></>)}
            </div>

            <div >
              <div className={Style.UserInfo}>
                <h3>{user ? user.username : ""}</h3>
                {FollowerAmmount !== null && <>Followers: {FollowerAmmount}</>}<br />
                {smort.getUser() &&
                  <>
                    {Follower !== null && id !== undefined && <button onClick={() => {
                      if (id !== undefined && !Follower) {
                        smort.FollowUser(id);
                        const newFollowingAmount = Number(FollowerAmmount) + 1;
                        setFollowerAmmount(newFollowingAmount.toString())
                        setFollower(true);

                      }
                      else if (id !== undefined && Follower) {
                        smort.UnfollowUser(id);
                        const newFollowingAmount = Number(FollowerAmmount) - 1;
                        setFollowerAmmount(newFollowingAmount.toString())
                        setFollower(false);
                      }
                    }}>{Follower ? <>Unfollow</> : <>Follow</>}</button>}
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        <Container className={Style.Videos}>
          <div className={Style.Scroll}>

            {VideoList !== null ?
              <ContentManegmentComponent posts={VideoList} AddCard={true} UsersAccount={(id === undefined)} /> :
              <>loading</>
            }
          </div>
        </Container>
      </div>
    </>
  )
}