import React, { createRef, useRef } from "react"

import Style from './ContentManegmentComponent.module.scss'

import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects"
import { Card, Col, Container, Modal, Row } from "react-bootstrap"

import { smortApi as smort } from "../../Api/smortApi"
import { UploadContentModal } from "../Modals/UploadContent.Modal"
import { ShowContentFullScreen } from "../Modals/ShowContentFullScreen.Modal"


interface VideoProps {
  posts: ThumbnailObject[]
  AddCard: boolean
  UsersAccount: boolean;
  DeleteMode: boolean;
}

interface States {
  EditUserData: boolean;
  UploadContent: boolean;
  Reload: number;
}

export default class ContentManegmentComponent extends React.Component<VideoProps, States> {
  private UploadContentComponent = createRef<UploadContentModal>();
  private ShowContentFullScreenComponent = createRef<ShowContentFullScreen>();

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      EditUserData: false,
      UploadContent: false,
      Reload: 0
    };
  }


  returnContentType(typeNumber: number): string {
    if (typeNumber === 1) {
      return "Image"
    } else {
      return "Video"
    }
  }

  render() {
    const user = smort.getUser();

    console.log(this.props.posts)
    return (
      <>
        <ShowContentFullScreen ref={this.ShowContentFullScreenComponent}/>
        <UploadContentModal ref={this.UploadContentComponent} />

        <Container className={Style.Scroll}>
          <div>
            <Row xs={3} md={3} className="g-2" >
              {this.props.UsersAccount &&
                <Col key={"Upload"} xs={6} sm={6} md={4} xl={3} >

                  <Card className="card">

                    <button className={Style.uploadContent} onClick={() => {
                      this.UploadContentComponent.current?.toggleModal();

                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                      </svg>
                    </button>
                  </Card>
                </Col>
              }

              {this.props.posts.map((item: ThumbnailObject, idx) => (
                <Col key={idx} xs={6} sm={6} md={4} xl={3} >

                  <Card className="card">
                    <div className={Style.VideoLink}
                      onClick={() => {
                        this.ShowContentFullScreenComponent.current?.toggleModal(item.Id);
                      }}>
                      <img
                        loading="lazy"
                        src={smort.GetImageUrl(item.Thumbnail !== null ? item.Thumbnail : item.File_Id)}
                        className={Style.SquareImage} />
                    </div>

                    {this.props.DeleteMode &&
                      <Card.Footer>
                        <button className={Style.DeleteButton}
                          onClick={() => {
                            if (item.Type === "img") {
                              smort.DeleteImage(item.Id);
                            } else {
                              smort.DeleteVideo(item.Id)
                            }
                            setTimeout(() => {
                              window.location.reload()
                            }, 1000)
                          }}>
                          Delete
                        </button>
                      </Card.Footer>
                    }
                  </Card>
                </Col>
              )
              )
              }
            </Row>
          </div>
        </Container>
      </>
    )
  }
}