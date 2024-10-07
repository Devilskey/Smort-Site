
import React, { JSX, useEffect, useState } from "react"
import { smortApi as smort } from "../Api/smortApi"
import { useNavigate } from "react-router-dom"
import { IMyProfile } from "../Api/ApiObjects/userObjects";
import { NavBarSmort } from "../component/Navbar";
import { Container } from "react-bootstrap";
import { Video } from "../Api/ApiObjects/VideoObject";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IMyProfile>();

  const[VideoList, SetVideoList] = useState<Video[]>();

  if (!smort.IsLogedIn()) {
    navigate("/login")
  }
  if (smort.getUser() === undefined) {
    smort.GetMyProfileAsync().then((profile) => {
      setUser(profile)
    })
  }

  smort.GetVideoListAsync().then((videos:Video[]) => {
    SetVideoList(videos)
  })

  return (
    <>
      <>
        <NavBarSmort />
        <Container>
          <video src={smort.GetVideoUrl(VideoList ? VideoList[0].Id : 0)}  loop autoPlay />
        </Container>

      </>
    </>
  )
}