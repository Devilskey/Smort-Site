import React from "react"

import Style from './ContentManegmentComponent.module.scss'

import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects"
import { Button, Card, Col, Modal, Row } from "react-bootstrap"

import { smortApi as smort } from "../../Api/smortApi"
import Add from "../../SiteAssets/images.png"
import { Videomanager } from "../../Api/UploadVideoManager"


interface VideoProps {
  posts: ThumbnailObject[]
  AddCard: boolean
  UsersAccount: boolean;
}

interface States {
  showState: boolean; // Define the type for showState
  VideoFile:File | null;
  Thumbnail:File | null;
  Title:string;
  Description:string;
}

export default class ContentManegmentComponent extends React.Component<VideoProps, States> {

  constructor(props: VideoProps) {
    super(props);
    this.state = {
      showState: false,
      VideoFile:null,
      Thumbnail:null,
      Title:"",
      Description:""
    };
  }

  toggleShowState() {
    this.setState(prevState => ({
      showState: !prevState.showState // Toggle the showState boolean
    }));
  }

  handleVideoFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null; // Get the file or null
    if (file) {
      const videoUrl = URL.createObjectURL(file); // Create a URL for the video file
      this.setState({ 
        VideoFile: file, 
      });
    }
  }

  handleThumbnailFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null; // Get the file or null
    this.setState({ Thumbnail: file }); // Set the Thumbnail in state
  }



  render() {

    return (<Row xs={2} md={3} className="g-4" >
      <Modal show={this.state.showState} onHide={() => { this.toggleShowState(); }} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload a video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label>Title: </label><br />
              <input type="text" onChange={(event) => { this.setState({ Title: event.target.value})}} /><br />
              <label>Discription: </label><br />
              <input type="text" onChange={(event) => { this.setState({ Description: event.target.value})}} /><br />

              <label>Thumbnail: </label>
              <input className="form-control" type="file" onChange={(event)=> {
                this.handleThumbnailFileUpload(event)
                if(event.target.files !== null){
                  Videomanager.encodeFileToBase64Image(event.target.files[0]);
                  }
                }}/>

              <label>Video: </label>
              <input className="form-control" type="file" onChange={(event)=> {
                this.handleVideoFileUpload(event)
                if(event.target.files !== null){
                Videomanager.encodeFileToBase64Video(event.target.files[0]);
                }
                }} /><br />

            </Col>
            <Col>
            {this.state.VideoFile && (
              <video width="600" controls>
                <source src={URL.createObjectURL(this.state.VideoFile)} type={this.state.VideoFile?.type} />
                Your browser does not support the video tag.
              </video>
            )}            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { this.toggleShowState(); }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { 
            Videomanager.setupVideoData(this.state.Title, this.state.Description);
            smort.UploadVideo(); 
            }}>
            upload video
          </Button>
        </Modal.Footer>
      </Modal>

      {(this.props.AddCard && this.props.UsersAccount) &&
        <button onClick={() => {
          this.toggleShowState();
        }}>+</button>
      }

      {this.props.posts.map((item: ThumbnailObject, idx) => (

        <Col key={idx}>
          <a href="#" className={Style.VideoLink}>
            <Card className="card">
              <Card.Img variant="top" src={smort.GetImageUrl(item.Thumbnail)} />
              <Card.Body>
                <Card.Title>{item.Title}</Card.Title>
              </Card.Body>
            </Card>
          </a>
        </Col>
      ))}
    </Row>)

  }
}