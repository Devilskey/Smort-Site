import React, {  forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button, Modal, } from "react-bootstrap";
import { ContentItem } from "../../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../../Api/smortApi";
import Style from "./ShowContentFullScreen.module.scss"
import { OptionsButtons } from "../../PostItemComponent/OptionsBar";
import { SmortVideo } from "../../MicroComponents/Video.smort";
import { AndroidHandler } from "../../../PlatformSpecificScripts/Android";
import { Link } from "react-router-dom";
import { size } from "../../../Api/enums/sizes";
import { useTranslation } from "../../../translations/TranslationProvider";
import { Img } from "../../../core/ImprovedControls/Img";

export type ShowContentFullScreenHandle = {
  toggleModal: (ContentId: number) => void;
}

export const ShowContentFullScreen = forwardRef<ShowContentFullScreenHandle>(({ }, ref) => {
  const [Show, setShow] = useState<boolean>(false);
  const [ContentItem, setContentItem] = useState<ContentItem[]>([]);
  const { t } = useTranslation();

  useEffect(() => {

  }, [setContentItem])

  useImperativeHandle(ref, () => ({
    toggleModal,
  }));


  const toggleModal = (ContentId: number = -1) => {
    if (ContentId !== -1) {
      smort.GetContentItemAsync(ContentId.toString()).then((item) => {
        setContentItem(item);
        setShow(true);
      }).catch(console.error)
    } else {
      setShow(false);

    }

  };

  return <>
    <Modal show={Show} className={Style.Modal} fullscreen={AndroidHandler.IsUsingAndroid() as string | true | undefined}>
        <Modal.Header className={Style.backgroundModalHeader}>
          <Button onClick={() => toggleModal()}>
            {t("uploadContent.close")}
          </Button>
        </Modal.Header>
        <Modal.Body className={Style.backgroundModal}>
          {ContentItem.length > 0 &&
            <>
            <div className={Style.User}>
              <Link to={`/account/${ContentItem[0].User_Id}`}
                className={Style.UserLink}>
                <Img className={Style.UserImgSimpel}
                  loading="lazy"
                  alt="An image Uploaded to smort"
                  width="55px" height="55px"
                  src={`${smort.GetProfilePictureImageUrl(ContentItem[0].User_Id)}&size=${size.M}`} />
                {ContentItem[0].Username}
              </Link>
            </div>
            
              <div className={Style.contentTitle}> {ContentItem[0].Description}</div>
              {ContentItem[0].Type === "img" ?
                <div>
                  <Img
                    loading="lazy"
                    src={smort.GetImageUrl(ContentItem[0].File_Id)}
                    className={Style.ImgContent} />
                </div>
                :
                <div className={Style.VideoContainer}>
                  <SmortVideo content={ContentItem[0]} />
                </div>
              }
              <OptionsButtons post={ContentItem[0]} />

            </>
          }
        </Modal.Body>
    </Modal>
  </>
});
