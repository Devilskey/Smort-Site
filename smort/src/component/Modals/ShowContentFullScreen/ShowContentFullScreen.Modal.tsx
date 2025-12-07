import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { ContentItem } from "../../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../../Api/smortApi";
import Style from "./ShowContentFullScreen.module.scss"
import { OptionsButtons } from "../../PostItemComponent/OptionsBar";
import { SmortVideo } from "../../MicroComponents/Video.smort";

export type ShowContentFullScreenHandle = {
  toggleModal: (ContentId: number) => void;
}

export const ShowContentFullScreen = forwardRef<ShowContentFullScreenHandle>(({ }, ref) => {
  const [Show, setShow] = useState<boolean>(false);
  const [ContentItem, setContentItem] = useState<ContentItem[]>([]);

  useEffect(() => {

  }, [setContentItem])

  useImperativeHandle(ref, () => ({
    toggleModal,
  }));


  const toggleModal = (ContentId: number = -1) => {
    if (ContentId !== -1) {
      console.log(ContentId);
      smort.GetContentItemAsync(ContentId.toString()).then((item) => {
        setContentItem(item);
        setShow(true);
      }).catch(console.error)
    } else {
      setShow(false);

    }

  };

  return <>
    <Modal show={Show} centered size="lg" className={Style.Modal}>
      <div className={Style.Modal}>
        <Modal.Header className={Style.backgroundModalHeader}>
          <button onClick={() => toggleModal()}>
            back
          </button>
        </Modal.Header>
        <Modal.Body className={Style.backgroundModal}>

          {ContentItem.length > 0 &&
            <>
              <div className={Style.contentTitle}> {ContentItem[0].Description}</div>
              {ContentItem[0].Type === "img" ?
                <div>
                  <img
                    loading="lazy"
                    src={smort.GetImageUrl(ContentItem[0].File_Id)}
                    className={Style.ImgContent} />
                  <OptionsButtons post={ContentItem[0]} />
                </div>
                :
                <div className={Style.VideoContainer}>
                  <SmortVideo content={ContentItem[0]} />
                </div>
              }
            </>
          }
        </Modal.Body>
      </div>
    </Modal>
  </>
});
