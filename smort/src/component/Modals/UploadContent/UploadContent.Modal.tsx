import { createRef, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Modal, Row, Button } from "react-bootstrap";
import { smortApi as smort } from "../../../Api/smortApi"
import { JSX } from "react/jsx-runtime";
import Style from "./UploadContent.module.scss"

export type UploadContentModalHandle = {
    toggleModal: () => void;
};

export interface IUploadContentModalProps {
    isAskMe?: boolean;
}

export const UploadContentModal = forwardRef<UploadContentModalHandle, IUploadContentModalProps>(({ isAskMe }, ref) => {

    const [ContentFile, setContentFile] = useState<File | null>(null)
    const [contentType, setContentType] = useState<string>("Nan")

    const [description, setDescription] = useState<string>("")

    const [ShowUploadContent, setShowUploadContent] = useState<boolean>(false);
    const InputFile = createRef<HTMLInputElement>();

    useImperativeHandle(ref, () => ({
        toggleModal,
    }));

    useEffect(() => {
        console.log("fuckl")
    }, [])


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null; // Get the file or null
        if (file) {
            setContentFile(file)
            getContentType(file);
        }
    }


    const getContentType = (file: File) => {
        if (!file) return "Nan";
        if (file.type.startsWith("image")) {setContentType("Image"); return}
        if (file.type.startsWith("video")) {setContentType("Video"); return}
        setContentType("Nan"); return;
    };


    const toggleModal = () => {
        setShowUploadContent(!ShowUploadContent);
    };

    const preview = useMemo(() => {
        if (!ContentFile) return null;
        const type = ContentFile.type;

        if (type.includes("image")) {
            return <img className={Style.PreviewImage} src={URL.createObjectURL(ContentFile)} />;
        }
        if (type.includes("video")) {
            return <video autoPlay className={Style.PreviewImage} src={URL.createObjectURL(ContentFile)} />;
        }
        return null;
    }, [ContentFile]);


    return <>
        <Modal show={ShowUploadContent} onHide={() => { toggleModal(); }} centered size="lg" className={Style.Modal}>
            <Modal.Header closeButton className={Style.backgroundModalHeader}>
                <Modal.Title>Upload content</Modal.Title>
            </Modal.Header>
            <Modal.Body className={Style.backgroundModal}>
                <Row>
                    <textarea
                        placeholder='Description....'
                        id="Descriptio"
                        value={description}
                        onChange={(event) => {
                            event.preventDefault()
                            setDescription(event.target.value)

                        }} /><br />

                    <input
                        hidden
                        accept="image/*,video/*"
                        className="form-control"
                        type="file"
                        ref={InputFile}
                        onChange={(event) => {
                            handleFileUpload(event)
                        }} />

                    {!isAskMe &&
                        <Button className={contentType !== "Nan" ? Style.UploadContentFilled : Style.UploadContentEmpty}
                            onClick={() => {
                                InputFile.current?.click()
                            }}>
                            {preview || "Upload your content here"}

                        </Button>
                    }

                </Row>
            </Modal.Body>
            <Modal.Footer className={Style.backgroundModalfooter}>
                <Button variant="secondary" onClick={() => { toggleModal(); }}>
                    Close
                </Button>
                <Button variant="primary"
                    disabled={(contentType === "Nan" && !isAskMe) || (description === "")}
                    onClick={() => {
                        if (isAskMe) {

                            smort.CreateQuestion(description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                            });
                        }
                        else if (contentType === "Video") {
                            smort.UploadVideo(ContentFile, "", description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                            });
                        } else {
                            smort.UploadPostImage(ContentFile, "", description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                            });
                        }
                    }}>
                    {isAskMe ? "Ask question" : `upload${contentType}`}
                </Button>
            </Modal.Footer>
        </Modal></>
});