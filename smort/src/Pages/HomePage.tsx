
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
import { Post, PostTranslate } from "../Api/ApiObjects/PostObject";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IMyProfile>();
  const [search, SetSearch] = useState<string>("");

  const { id } = useParams();
  const { ContentType } = useParams();

  const [PostList, SetPostList] = useState<Post[]>([]);

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
          AddToPostList(ImageFromApi);
        })
      }else{
        AddToPostList(ImageFromApi);
      }
    })
      .catch((error) => console.error("Failed to fetch Images:", error));

    smort.GetVideoListAsync()
      .then((videos: Video[]) => {
        VideoFromApi.push(...videos)
        if (id !== undefined && ContentType === "Video") {
          smort.GetVideoAsync(id).then((videos: Video[]) => {
            VideoFromApi.unshift(...videos)
            AddToPostList(VideoFromApi);
          })
        }else{
          AddToPostList(VideoFromApi);
        }

      })
      .catch((error) => console.error("Failed to fetch videos:", error));
  }, []);

  const AddToPostList = (list: PostImage[] |Video[] ) => {
      const Posts:Post[] = PostList;
      const newPosts = list.map(item=>{
        return PostTranslate.ToPost(item);
      })
      Posts.push(...newPosts);
      console.log(Posts);
      SetPostList(Posts);
  }


  const GetSearchResults = () => {
    if (showTypeContent === "Video") {
      if (search === "") {
        smort.GetVideoListAsync()
          .then((videos: Video[]) => {
            // SetVideoList(videos);
          })
          .catch((error) => console.error("Failed to fetch videos:", error));
        return;
      }
      if (search === "") {

      }
      smort.GetSearchResultsAsync(search).then((Videos: Video[]) => {
        // SetVideoList(Videos);
      })

      return;
    }
    if (search === "") {
      smort.GetListImagePost().then((imagePosts: PostImage[]) => {
        // SetPostImagesList(imagePosts);
      })
        .catch((error) => console.error("Failed to fetch Images:", error));
      return;
    }

    smort.GetSearchResultsImagePostAsync(search).then((imagePosts: PostImage[]) => {
      // SetPostImagesList(imagePosts);
    })
  }

  return (
    <>
      <div className={Style.Page}>
        <NavBarSmort />
        <Container className={Style.HomeOptions}>

        </Container>

        <Container className={Style.HomeFeed}>
          <div className={Style.Scroll}>
            { PostList.length > 0 ? (
              <>
                <ContentItemsRender postsList={PostList} />
              </>) : (
                <>
                lOADING..
                </>)
            }
          </div>

        </Container>

      </div>
    </>
  )
}