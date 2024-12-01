
import React, { JSX, useEffect, useState } from "react"
import { smortApi as smort } from "../Api/smortApi"
import { useNavigate, useParams } from "react-router-dom"
import { IMyProfile } from "../Api/ApiObjects/userObjects";
import { NavBarSmort } from "../component/Navbar";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Video } from "../Api/ApiObjects/VideoObject";
import Style from './HomePage.module.scss';
import ContentItemsRender from "../component/VideoItemComponent/ContentItemsRender";
import { PostImage } from "../Api/ApiObjects/PostImageObjects";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IMyProfile>();
  const [search, SetSearch] = useState<string>("");

  const { id } = useParams();
  const { ContentType } = useParams();


  const [VideoList, SetVideoList] = useState<Video[]>([]);
  const [PostList, SetPostList] = useState<PostImage[]>([]);
  const [showTypeContent, setShowTypeContent] = useState("Video");

  useEffect(() => {

    if (ContentType !== undefined) {
      setShowTypeContent(ContentType);
    }

    let VideoFromApi: Video[] = [];
    let ImageFromApi: PostImage[] = [];

    // Fetch user profile only once
    if (smort.getUser() === undefined) {
      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => console.error("Failed to fetch profile:", error));
    }

    smort.GetListImagePost().then((imagePosts: PostImage[]) => {
      ImageFromApi.unshift(...imagePosts)
      if (id !== undefined && ContentType === "Image") {
        smort.GetImageAsync(id).then((images: PostImage[]) => {
          ImageFromApi.unshift(...images)
          SetPostList(imagePosts);
        })
      } else {
        SetPostList(ImageFromApi);
      }

    })
      .catch((error) => console.error("Failed to fetch Images:", error));

    smort.GetVideoListAsync()
      .then((videos: Video[]) => {
        VideoFromApi.push(...videos)
        if (id !== undefined && ContentType === "Video") {
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


  const GetSearchResults = () => {
    if (showTypeContent === "Video") {
      if (search === "") {
        smort.GetVideoListAsync()
          .then((videos: Video[]) => {
            SetVideoList(videos);
          })
          .catch((error) => console.error("Failed to fetch videos:", error));
        return;
      }
      if (search === "") {

      }
      smort.GetSearchResultsAsync(search).then((Videos: Video[]) => {
        SetVideoList(Videos);
      })

      return;
    }
    if (search === "") {
      smort.GetListImagePost().then((imagePosts: PostImage[]) => {
        SetPostList(imagePosts);
      })
        .catch((error) => console.error("Failed to fetch Images:", error));
      return;
    }

    smort.GetSearchResultsImagePostAsync(search).then((imagePosts: PostImage[]) => {
      SetPostList(imagePosts);
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
                  <Col sm="11" xs="8">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      onChange={(Element) => {
                        SetSearch(Element.target.value)

                      }} />
                  </Col>
                  <Col sm="1" xs="4">
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={(event) => {
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
            <div className={Style.ContentType}>
              <Button className={Style.TypeVideo} onClick={() => { setShowTypeContent("Video") }}>Videos</Button>
              <Button className={Style.TypeImage} onClick={() => { setShowTypeContent("Image") }}> Images</Button>
            </div>
          </Form>
          <hr />
        </Container>

        <Container className={Style.HomeFeed}>
          <div className={Style.Scroll}>
            {VideoList.length > 0 ? (
              <>
                <ContentItemsRender VideoList={VideoList} PostImage={PostList} ShowTypeOfContent={showTypeContent} />
              </>) : (<>lOADING..</>)
            }
          </div>

        </Container>

      </div>
    </>
  )
}