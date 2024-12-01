import React from "react"

import Style from './ContentManegmentComponent.module.scss'

import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects"
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap"

import { smortApi as smort } from "../../Api/smortApi"
import Add from "../../SiteAssets/images.png"
import { Link } from "react-router-dom"


interface VideoProps {
  posts: ThumbnailObject[]
  AddCard: boolean
  UsersAccount: boolean;
}

interface States {
  showState: boolean; // Define the type for showState
  ContentFile: File | null;
  Thumbnail: File | null;
  Title: string;
  Description: string;
  TypeOfContent: string;
}

export default class ContentManegmentComponent extends React.Component<VideoProps, States> {

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      showState: false,
      ContentFile: null,
      Thumbnail: null,
      TypeOfContent: "video",
      Title: "",
      Description: ""
    };
  }

  toggleShowState() {
    this.setState(prevState => ({
      showState: !prevState.showState // Toggle the showState boolean
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

  returnContentType (typeNumber: number):string {
    if(typeNumber === 1){
      return "Image"
    }else{
      return "Video"
    }
  }

  render() {
    console.log(this.props.posts.filter(post => post.Type === 0))
    return (
      <>
        {(this.props.AddCard && this.props.UsersAccount) &&
          <button className={Style.UploadVideo} onClick={() => {
            this.toggleShowState();
          }}>Upload new content</button>
        }
        <Modal show={this.state.showState} onHide={() => { this.toggleShowState(); }} centered size="lg">
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
            <Button variant="secondary" onClick={() => { this.toggleShowState(); }}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              if (this.state.TypeOfContent === "Video") {
                smort.UploadVideo(this.state.ContentFile, this.state.Thumbnail, this.state.Title, this.state.Description);
              } else {
                smort.UploadPostImage(this.state.ContentFile, this.state.Title, this.state.Description);
              }
            }}>
              upload video
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
                        <Card.Img variant="top" src={smort.GetImageUrl(item.Thumbnail)} />
                        <Card.Body>
                          <Card.Title>{item.Title}</Card.Title>
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
            <Row xs={2} md={3} className="g-4" >
              {this.props.posts.map((item: ThumbnailObject, idx) => {
                if (item.Type === 0) {
                  return;
                }
                return (

                  <Col key={idx} xs={12} sm={6} md={4} xl={3} >
                    <Link to={`/home/${this.returnContentType(item.Type)}/${item.Id}`} className={Style.VideoLink}>
                      <Card className="card">
                        <Card.Img variant="top" src={smort.GetImageUrl(item.Thumbnail)} />
                        <Card.Body>
                          <Card.Title>{item.Title}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Link>
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