import React, { createRef, useRef } from "react"

import Style from './ContentManegmentComponent.module.scss'

import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects"
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap"

import { smortApi as smort } from "../../Api/smortApi"
import Add from "../../SiteAssets/images.png"
import { Link } from "react-router-dom"
import { EeditUserType } from "../../Api/enums/EditUserEnum"
import { EditUserDataModal } from "../Modals/EditUserData.Modal"
import { PageNavigation } from "../../Router"


interface VideoProps {
  posts: ThumbnailObject[]
  AddCard: boolean
  UsersAccount: boolean;
}

interface States {
  EditUserData: boolean;
  UploadContent: boolean;
  ContentFile: File | null;
  Thumbnail: File | null;
  Title: string;
  Description: string;
  TypeOfContent: string;
  DeleteMode: boolean;
  Reload: number
}

export default class ContentManegmentComponent extends React.Component<VideoProps, States> {
  private EditUserComponent = createRef<EditUserDataModal>();

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      EditUserData: false,
      UploadContent: false,
      ContentFile: null,
      Thumbnail: null,
      TypeOfContent: "Video",
      Title: "",
      Description: "",
      DeleteMode: false,
      Reload: 0
    };
  }

  toggleUploadContent() {
    this.setState(prevState => ({
      UploadContent: !prevState.UploadContent // Toggle the UploadContent boolean
    }));
  }


  handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null; // Get the file or null
    if (file) {
      this.setState({
        ContentFile: file,
      });
    }
  }

  handleThumbnailFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file) {
      this.setState({
        Thumbnail: file,
      });
    }
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

    console.log(this.props.posts.filter(post => post.Type === 0))
    return (
      <>
        <div className={Style.OptionsButton}>
          {(this.props.AddCard && this.props.UsersAccount) &&
            <button className={Style.UploadVideo} onClick={() => {
              this.toggleUploadContent();
            }}>Upload </button>
          }
          {this.props.UsersAccount === true && (
            <button className={Style.EditButton} onClick={() => {
              this.setState({ DeleteMode: !this.state.DeleteMode })
            }}>Delete </button>
          )}
          {this.props.UsersAccount === true && (
            <button className={Style.EditButton} onClick={() => {
              this.EditUserComponent.current?.toggleModal();
            }}>Edite user</button>
          )}

        </div>

        <EditUserDataModal ref={this.EditUserComponent} user={smort.getUser()!} />

        <Modal show={this.state.UploadContent} onHide={() => { this.toggleUploadContent(); }} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Upload content</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <select onChange={(event) => {
                this.setState({ TypeOfContent: event.target.value })
                console.log(event.target.value)
              }}>
                <option value="Video" >Video</option>
                <option value="Image">Image</option>
              </select><br />

              <label>Title: </label><br />
              <input type="text" onChange={(event) => { this.setState({ Title: event.target.value }) }} /><br />
              <label>Discription: </label><br />
              <input type="text" onChange={(event) => { this.setState({ Description: event.target.value }) }} /><br />

              {this.state.TypeOfContent !== "Image" ? (<>
                <label>Thumbnail: </label>
                <input className="form-control" type="file" onChange={(event) => {
                  this.handleThumbnailFileUpload(event)

                }} />
              </>) : (<></>)
              }

              <label> {this.state.TypeOfContent} </label>
              <input className="form-control" type="file" onChange={(event) => {
                this.handleFileUpload(event)

              }} /><br />


            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { this.toggleUploadContent(); }}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              if (this.state.TypeOfContent === "Video") {
                smort.UploadVideo(this.state.ContentFile, this.state.Thumbnail, this.state.Title, this.state.Description).then(worked => {
                  if (worked === true) {
                    this.toggleUploadContent();
                    window.location.reload();
                  }
                });;
              } else {
                smort.UploadPostImage(this.state.ContentFile, this.state.Title, this.state.Description).then(worked => {
                  if (worked === true) {
                    this.toggleUploadContent();
                    window.location.reload();
                  }
                });
              }
            }}>
              upload {this.state.TypeOfContent}
            </Button>
          </Modal.Footer>
        </Modal>


        <Container className={Style.Scroll}>
          <div>
            {this.props.posts.filter(post => post.Type === 0).length > 0 && <>
              <h1>Videos</h1>
              <hr />
              <Row xs={2} md={3} className="g-4" >

                {this.props.posts.map((item: ThumbnailObject, idx) => {
                  if (item.Type === 1) {
                    return;
                  }
                  return (

                    <Col key={idx} xs={12} sm={6} md={4} xl={3} >
                      <Link to={`/home/${this.returnContentType(item.Type)}/${item.Id}`} className={Style.VideoLink}>
                        <Card className="card">
                        <img
                            loading="lazy"
                            src={smort.GetImageUrl(item.Thumbnail)} 
                            className={Style.SquareImage}/>
                          <Card.Body>
                            <Card.Title>{item.Title}</Card.Title>
                            {this.state.DeleteMode &&
                              <Card.Footer>
                                <button className={Style.DeleteButton}
                                  onClick={() => {
                                    smort.DeleteVideo(item.Id);
                                    window.location.reload()
                                  }}>
                                  Delete
                                </button>
                              </Card.Footer>
                            }
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </Row>

            </>}
            {this.props.posts.filter(post => post.Type === 1).length > 0 && <>
              <h1>Images</h1>
              <hr />
              <Row xs={3} md={3} className="g-4" >
                {this.props.posts.map((item: ThumbnailObject, idx) => {
                  if (item.Type === 0) {
                    return;
                  }

                  return (

                    <Col key={idx} xs={6} sm={6} md={4} xl={3} >

                      <Card className="card">
                        <Link to={`/home/${this.returnContentType(item.Type)}/${item.Id}`} className={Style.VideoLink}>
                        <img
                            loading="lazy"
                            src={smort.GetImageUrl(item.Thumbnail)} 
                            className={Style.SquareImage}/>
                          <Card.Body>
                            <Card.Title>{item.Title}</Card.Title>

                          </Card.Body>
                        </Link>

                        {this.state.DeleteMode &&
                          <Card.Footer>
                            <button className={Style.DeleteButton}
                              onClick={() => {
                                smort.DeleteImage(item.Id);
                                window.location.reload()
                              }}>
                              Delete
                            </button>
                          </Card.Footer>
                        }
                      </Card>
                    </Col>
                  )
                })
                }
              </Row>
            </>}
          </div>
        </Container>
      </>
    )
  }
}