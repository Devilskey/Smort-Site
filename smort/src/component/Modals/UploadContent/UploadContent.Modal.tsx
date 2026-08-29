import { createRef, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Modal, Row, Button, Spinner } from "react-bootstrap";
import { smortApi as smort } from "../../../Api/smortApi"
import { JSX } from "react/jsx-runtime";
import Style from "./UploadContent.module.scss"
import { useTranslation } from "../../../translations/TranslationProvider";
import { AndroidHandler } from "../../../PlatformSpecificScripts/Android";
import { PhotoFilmIcon, QuestionIcon } from "../../../core/Icon";
import { Img } from "../../../core/ImprovedControls/Img";
import { Video } from "../../../core/ImprovedControls/Video";

export type UploadContentModalHandle = {
    toggleModal: () => void;
};

export interface IUploadContentModalProps {
    isAskMeAhead?: boolean;
}

export const UploadContentModal = forwardRef<UploadContentModalHandle, IUploadContentModalProps>(({ isAskMeAhead }, ref) => {
    const { t } = useTranslation();

    const [ContentFile, setContentFile] = useState<File | null>(null)
    const [contentType, setContentType] = useState<string>("Nan")

    const [description, setDescription] = useState<string>("")

    const [ShowUploadContent, setShowUploadContent] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [selectPostType, setselectPostType] = useState<'Ask'| 'Foto or video'| undefined>(undefined);
    const [isAskMe, setIsAskMe] = useState<boolean>(isAskMeAhead ?? false);

    const InputFile = createRef<HTMLInputElement>();

    useImperativeHandle(ref, () => ({
        toggleModal,
    }));

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
            return <Img className={Style.PreviewImage} src={URL.createObjectURL(ContentFile)} />;
        }
        if (type.includes("video")) {
            return <Video autoPlay className={Style.PreviewImage} src={URL.createObjectURL(ContentFile)} />;
        }
        return null;
    }, [ContentFile]);

    const getUploadButtonText = (): string => {
        if (isAskMe) {
            return t('uploadContent.askQuestion');
        }

        if (contentType === 'Video') {
            return t('uploadContent.uploadVideo');
        }

        if (contentType === 'Image') {
            return t('uploadContent.uploadImage');
        }

        return t('uploadContent.prompt');
    };

    const onClose = () => { 
        setselectPostType(undefined); 
        setIsAskMe(false);
        toggleModal(); 
    }

    return <>
        <Modal show={ShowUploadContent} onHide={onClose} centered size="lg" className={Style.Modal} 
        fullscreen={AndroidHandler.IsUsingAndroid() as string | true | undefined}>
            <Modal.Header closeButton className={Style.backgroundModalHeader}>
                <Modal.Title>{t('uploadContent.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={Style.backgroundModal}>

                {selectPostType != undefined ?
                <div className={Style.Form}>
                    <textarea
                        placeholder={isAskMe ? t('uploadContent.placeholderQuestion') :  t('uploadContent.placeholderDescription')}
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
                        <Button className={ + " " + contentType !== "Nan" ? Style.UploadContentFilled : Style.UploadContentEmpty}
                            onClick={() => {
                                InputFile.current?.click()
                            }}>

                            {preview || <>{t('uploadContent.prompt')}<PhotoFilmIcon/></>}

                        </Button>
                    } : 
                </div>: 
                <>
                    <Button className={Style.AskOption} onClick={()=> { 
                        setselectPostType('Ask') 
                            setIsAskMe(true)

                    }}>
                        <QuestionIcon/>
                        <div>Ask Question</div>
                        </Button>
                    <Button className={Style.PostOption} onClick={
                        ()=> {
                            setselectPostType('Foto or video');
                        }}>
                        <PhotoFilmIcon/>
                        <div>Post image or video</div>
                        </Button>

                </>
                }


            </Modal.Body>
             <Modal.Footer className={Style.backgroundModalfooter}>
                <Button variant="secondary" onClick={onClose}>
                    {t('uploadContent.close')}
                </Button>
                <Button variant="primary"
                    disabled={(contentType === "Nan" && !isAskMe) || (description === "") || isUploading}
                    onClick={() => {
                        setIsUploading(true);
                        if (isAskMe) {

                            smort.CreateQuestion(description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                                setIsUploading(false);
                            });
                        }
                        else if (contentType === "Video") {
                            smort.UploadVideo(ContentFile, "", description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                                setIsUploading(false);
                            });
                        } else {
                            smort.UploadPostImage(ContentFile, "", description).then(worked => {
                                if (worked === true) {
                                    toggleModal();
                                }
                                setIsUploading(false);

                            });
                        }
                    }}>
                    {getUploadButtonText()} {isUploading && <Spinner animation="border" size="sm" />}
                </Button>
            </Modal.Footer>
        </Modal></>
});