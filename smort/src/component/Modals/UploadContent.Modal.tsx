import { Component } from "react";
import { Modal, Row, Button } from "react-bootstrap";
import { smortApi as smort } from "../../Api/smortApi"


interface UploadContentModalProps {
}

interface UploadContentModalState {
    ContentFile: File | null;
    Thumbnail: File | null;
    Title: string;
    Description: string;
    TypeOfContent: string;
    ShowUploadContent: boolean;
}


export class UploadContentModal extends Component<UploadContentModalProps, UploadContentModalState> {


    constructor(props: UploadContentModalProps) {
        super(props);
        this.state = {
            ContentFile: null,
            Thumbnail: null,
            Title: "",
            Description: "",
            TypeOfContent: "Video",
            ShowUploadContent: false
        };
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

    toggleModal = () => {
        this.setState({ ShowUploadContent: !this.state.ShowUploadContent });
    };

    public render() {
        return <>
            <Modal show={this.state.ShowUploadContent} onHide={() => { this.toggleModal(); }} centered size="lg">
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

                        {/* <label>Title: </label><br />
                        <input type="text" onChange={(event) => { this.setState({ Title: event.target.value }) }} /><br /> */}
                        <label>Discription: </label><br />
                        <input type="text" onChange={(event) => { this.setState({ Description: event.target.value }) }} /><br />

                        <label> {this.state.TypeOfContent} </label>
                        <input className="form-control" type="file" onChange={(event) => {
                            this.handleFileUpload(event)

                        }} /><br />


                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { this.toggleModal(); }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        if (this.state.TypeOfContent === "Video") {
                            console.log(this.state.TypeOfContent);

                            smort.UploadVideo(this.state.ContentFile, this.state.Title, this.state.Description).then(worked => {
                                if (worked === true) {
                                    this.toggleModal();
                                    window.location.reload();
                                }
                            });
                        } else {
                            smort.UploadPostImage(this.state.ContentFile, this.state.Title, this.state.Description).then(worked => {
                                if (worked === true) {
                                    this.toggleModal();
                                    window.location.reload();
                                }
                            });
                        }
                    }}>
                        upload {this.state.TypeOfContent}
                    </Button>
                </Modal.Footer>
            </Modal></>
    }
}