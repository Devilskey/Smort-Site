
import React, { createRef, JSX, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Card, Col, Container, Row } from "react-bootstrap";

import { smortApi as smort } from "../../Api/smortApi";
import { IMyProfile } from "../../Api/ApiObjects/userObjects";
import { NavBarSmortPc } from "../../component/NavbarPc";

import Style from "./AccountPage.module.scss";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import { EditUserDataModal, EditUserDataModalHandle } from "../../component/Modals/EditUserData.Modal";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";
import { ShowContentFullScreen } from "../../component/Modals/ShowContentFullScreen.Modal";
import { UploadIcon } from "../../icons/Interections.icon";
import { ThumbnailCard } from "../../component/ThumbnailCard/ThumbnailCard";
import { size } from "../../Api/enums/sizes";
import { UploadContentModal, UploadContentModalHandle } from "../../component/Modals/UploadContent.Modal";


export const AccountPage = (): JSX.Element => {
  const [user, setUser] = useState<IMyProfile>();
  const { id } = useParams()
  const [ContentList, SetContentList] = useState<ThumbnailObject[] | null>(null);
  const [Follower, setFollower] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  const [FollowerAmmount, setFollowerAmmount] = useState<string | null>(null);
  const EditUserComponent = createRef<EditUserDataModalHandle>();
  const UploadContentComponent = useRef<UploadContentModalHandle>(null);

  useEffect(() => {
    // Fetch user profile only once
    if (smort.getUser() === undefined && id === undefined) {

      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => setUser(undefined));
    }
    else if (id !== undefined) {
      smort.GetProfileAsync(Number(id))
        .then((profile: any) => {

          setUser(profile)
        })
        .catch((error) => console.error("Failed to fetch profile:", error));
    }
    else {
      setUser(smort.getUser())
    }

    console.log(id)
    if (id !== undefined) {
      smort.GetUsersContent(Number(id)).then((data: ThumbnailObject[]) => {
        console.log(data);
        SetContentList(data);
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
        SetContentList(data);
      })
      smort.GetMyFollowersAsync().then((FollowerAmmount: string) => {
        setFollowerAmmount(FollowerAmmount)
      })
    }
  }, []);


  const Search = (search: string) => {
    console.log(search);
  }

  console.log("ContentList:", ContentList);

  return (
    <>
      <EditUserDataModal ref={EditUserComponent} user={smort.getUser()!} />
      <UploadContentModal ref={UploadContentComponent} />

      <div className={Style.Page}>
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={Search} />
        }
        {/** Users Information */}
        <div className={Style.UserInfoBackground}>
          <div className={Style.UserDataComplete}>
            <div >
              {user ? (
                <div className={Style.UserImgSpace}>
                  <img
                    src={`${smort.GetImageUrl(user.profile_Picture)}&size=${size.L}`}
                    alt="User profile"
                    className={Style.UserImg}
                  />
                </div>
              ) : (<></>)}
            </div>

            <div >
              <div className={Style.UserInfo}>
                <h3>{user ? user.username : ""}
                  {(id === undefined) && (
                    <>
                      <button className={Style.EditUser} onClick={() => {
                        EditUserComponent.current?.toggleModal();
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                      </button>
                      <button className={Style.EditUser} onClick={() => {
                        setDeleteMode(!deleteMode)
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg> </button>
                    </>
                  )}
                </h3>
                {FollowerAmmount !== null && <>Followers: {FollowerAmmount}</>}<br />
                {smort.getUser() && smort.getUser()?.username !== user?.username &&
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
        {/** Users Content */}
        <Container className={Style.Scroll}>
          <div>
            <Row xs={3} md={3} className="g-2" >
              {user !== undefined &&
                <Col key={"Upload"} xs={6} sm={6} md={4} xl={3} >
                  <Card className="card">

                    <button className={Style.uploadContent} onClick={() => {
                      console.log("CLICK");

                      UploadContentComponent.current?.toggleModal();
                    }}>
                      <UploadIcon />
                    </button>

                  </Card>
                </Col>
              }
              {ContentList?.map((item: ThumbnailObject, idx) => (
                <ThumbnailCard Post={item} deleteMode={deleteMode} />
              ))}
            </Row>
          </div>
        </Container>
        {AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={Search} />
        }
      </div>
    </>
  )
}