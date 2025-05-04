import { createRef, forwardRef, useState } from "react";
import { Modal, Row, Button } from "react-bootstrap";
import { smortApi as smort } from "../../Api/smortApi"
import { JSX } from "react/jsx-runtime";
import Style from "./UploadContent.module.scss"

export type UploadContentModalHandle = {
    toggleModal: () => void;
};

export const UploadContentModal = forwardRef<UploadContentModalHandle>(() => {

    const [ContentFile, setContentFile] = useState<File | null>(null)
    const [Title, setTitle] = useState<string>("")
    const [ShowUploadContent, setShowUploadContent] = useState<boolean>(false);
    let Description = "";
    const InputFile = createRef<HTMLInputElement>();



    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null; // Get the file or null
        if (file) {
            setContentFile(file)
        }
    }


    const GetContentType = (): string => {
        if (ContentFile === null) {
            return "Nan";
        }

        if (ContentFile.type.includes("image")) {
            return "Image"
        }
        if (ContentFile.type.includes("video")) {
            console.log(ContentFile.type)

            return "Video"
        }
        return "Nan"
    }

    const ShowVideo = (): JSX.Element => (<video autoPlay className={Style.PreviewImage} src={ContentFile ? URL.createObjectURL(ContentFile) : ''} />);
    const ShowImage = (): JSX.Element => (<img className={Style.PreviewImage} src={ContentFile ? URL.createObjectURL(ContentFile) : ''} />);

    const toggleModal = () => {
        setShowUploadContent(!ShowUploadContent);
    };

    return <>
        <Modal show={ShowUploadContent} onHide={() => { toggleModal(); }} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Upload content</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {/* <label>Title: </label><br />
                        <input type="text" onChange={(event) => { this.setState({ Title: event.target.value }) }} /><br /> */}
                    <label>Discription: </label><br />
                    <textarea
                        placeholder='Description....'
                        onChange={(event) => Description = event.target.value} /><br />

                    <input
                        hidden
                        accept="image/*,video/*"
                        className="form-control"
                        type="file"
                        ref={InputFile}
                        onChange={(event) => {
                            handleFileUpload(event)

                        }} />

                    <Button className={GetContentType() !== "Nan" ? Style.UploadContentFilled : Style.UploadContentEmpty}
                        onClick={() => {
                            InputFile.current?.click()
                        }}>
                        {ContentFile ?
                            <>{GetContentType() !== "Nan" ?
                                <> {GetContentType() === "Video" ? <ShowVideo /> : <ShowImage />}
                                </> : <>ERROR Please upload an image or a video</>}</> :
                            <>Upload your content here</>}
                    </Button>

                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { toggleModal(); }}>
                    Close
                </Button>
                <Button variant="primary"
                    disabled={GetContentType() === "Nan"}
                    onClick={() => {
                        if (GetContentType() === "Video") {
                            smort.UploadVideo(ContentFile, Title, Description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                            });
                        } else {
                            smort.UploadPostImage(ContentFile, Title, Description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                            });
                        }
                    }}>
                    upload {GetContentType()}
                </Button>
            </Modal.Footer>
        </Modal></>
});