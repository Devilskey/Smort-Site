
import React, { JSX, useEffect, useState } from "react"
import { smortApi as smort } from "../Api/smortApi"
import { useNavigate, useParams } from "react-router-dom"
import { IMyProfile } from "../Api/ApiObjects/userObjects";
import { NavBarSmort } from "../component/Navbar";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Video } from "../Api/ApiObjects/VideoObject";
import Style from './HomePage.module.scss';
import VideoItemsRender from "../component/VideoItemComponent/VideoItems";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IMyProfile>();
  const [search, SetSearch] = useState<string>("");

  const { id } = useParams();

  const [VideoList, SetVideoList] = useState<Video[]>([]);

  useEffect(() => {

    let VideoFromApi: Video[] = [];
    // Fetch user profile only once
    if (smort.getUser() === undefined) {
      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => console.error("Failed to fetch profile:", error));
    }

    smort.GetVideoListAsync()
      .then((videos: Video[]) => {
        VideoFromApi.push(...videos)
        if (id !== undefined) {
          smort.GetVideoAsync(id).then((videos: Video[]) => {
            VideoFromApi.unshift(...videos)
            SetVideoList(VideoFromApi);
          })
        } else {
          SetVideoList(VideoFromApi);
        }

      })
      .catch((error) => console.error("Failed to fetch videos:", error));

  }, []);


  const GetSearchResults = () =>{
      smort.GetSearchResultsAsync(search).then((Videos:Video[]) => {
        SetVideoList(Videos);
      })
  }

  return (
    <>
      <div className={Style.Page}>
        <NavBarSmort />
        <Container className={Style.HomeOptions}>
          <Form className={Style.HomeOptionsForm}>
            <Row>
              <Col>
                <Form.Group as={Row}>
                  <Col sm="11">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      onChange={(Element) => {
                        SetSearch(Element.target.value)

                      }} />
                  </Col>
                  <Col sm="1">
                    <Button 
                    variant="primary" 
                    type="submit"
                    onClick={(event)=> {
                      event.preventDefault();
                      GetSearchResults();
                    }}
                    >
                      Submit
                    </Button>                 
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
                <VideoItemsRender VideoList={VideoList} />
              </>) : (<>lOADING..</>)
            }
          </div>

        </Container>

      </div>
    </>
  )
}