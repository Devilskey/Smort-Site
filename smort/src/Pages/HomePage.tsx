
import React, { JSX, useEffect, useState } from "react"
import { smortApi as smort } from "../Api/smortApi"
import { useNavigate } from "react-router-dom"
import { IMyProfile } from "../Api/ApiObjects/userObjects";
import { NavBarSmort } from "../component/Navbar";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Video } from "../Api/ApiObjects/VideoObject";
import Style from './HomePage.module.scss';
import VideoItemsRender from "../component/VideoItemComponent/VideoItems";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IMyProfile>();
  const [search, SetSearch] = useState<string>("");

  const [VideoList, SetVideoList] = useState<Video[]>([]);
  useEffect(() => {
    if (!smort.IsLogedIn()) {
      navigate("/login");
    }

    // Fetch user profile only once
    if (smort.getUser() === undefined) {
      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => console.error("Failed to fetch profile:", error));
    }

    smort.GetVideoListAsync()
      .then((videos: Video[]) => SetVideoList(videos))
      .catch((error) => console.error("Failed to fetch videos:", error));

    smort.GetVideoListAsync().then((videos: Video[]) => {
      SetVideoList(videos)
    })
  }, []);

  return (
    <>
      <>
        <NavBarSmort />
        <Container className={Style.HomeOptions}>
          <Form className={Style.HomeOptionsForm}>
            <Row>
              <Col>
                <Form.Group as={Row}>
                  <Form.Label column sm="3">search:</Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      onChange={(Element) => { SetSearch(Element.target.value) }} />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <hr />
        </Container>

        <Container className={Style.HomeFeed}>
          <div className={Style.Scroll}>
            {VideoList.length > 0 ? (
              <>
                <VideoItemsRender  VideoList={VideoList} />
              </>) : (<>lOADING..</>)
            }
          </div>

        </Container>

      </>
    </>
  )
}