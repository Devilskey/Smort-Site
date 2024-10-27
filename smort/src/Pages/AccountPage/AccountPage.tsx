
import React, { JSX, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Col, Container, Form, Row } from "react-bootstrap";

import { smortApi as smort } from "../../Api/smortApi";
import { Video } from "../../Api/ApiObjects/VideoObject";
import { IMyProfile } from "../../Api/ApiObjects/userObjects";
import { NavBarSmort } from "../../component/Navbar";

import Style from "./AccountPage.module.scss";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import ThumbnailComponent from "../../component/ThumbnailComponent/ContentManegmentComponent";
import ContentManegmentComponent from "../../component/ThumbnailComponent/ContentManegmentComponent";


export const AccountPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IMyProfile>();
  const [search, SetSearch] = useState<string>("");
  const { id } = useParams()
  const [VideoList, SetVideoList] = useState<ThumbnailObject[] | null>(null);

  useEffect(() => {
    // Fetch user profile only once
    if (smort.getUser() === undefined && id === undefined) {
      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => console.error("Failed to fetch profile:", error));
    } else if (id !== undefined) {
      smort.GetProfileAsync(Number(id))
        .then((profile:any) => {

          setUser(profile)
        })
        .catch((error) => console.error("Failed to fetch profile:", error));
    } else {
      setUser(smort.getUser())
    }
    console.log(id)
    if (id !== undefined) {
      smort.GetThumbnail(Number(id)).then((data: ThumbnailObject[]) => {
        console.log(data);
        SetVideoList(data);
      })
    } else {
      smort.GetMyThumbnail().then((data: ThumbnailObject[]) => {
        console.log(data);
        SetVideoList(data);
      })
    }
  }, []);

  return (
    <>
      <>
        <NavBarSmort />
        <div className={Style.UserInfoBackground}>
          {user ? (
            <Container className={Style.UserInfo}>
                <img
                  src={smort.GetImageUrl(user.profile_Picture)}
                  alt="User profile"
                  className={Style.UserImg}
                />
              <h1>{user.username}</h1>
            </Container>
          ): (<></>)}

        </div>
        <Container className={Style.Videos}>
          {VideoList !== null ?
            <ContentManegmentComponent posts={VideoList} AddCard={true} UsersAccount={(id === undefined)}/> :
            <>loading</>
          }
        </Container>
      </>
    </>
  )
}