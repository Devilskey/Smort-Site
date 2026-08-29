import { Col, Card } from "react-bootstrap";
import Style from './ThumbnailCard.module.scss'
import { smortApi as smort } from "../../Api/smortApi";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import { createRef, ReactElement } from "react";
import { useTranslation } from "../../translations/TranslationProvider";
import { ShowContentFullScreen, ShowContentFullScreenHandle } from "../Modals/ShowContentFullScreen/ShowContentFullScreen.Modal";
import { TrashIcon } from "../../core/Icon";
import { Img } from "../../core/ImprovedControls/Img";

interface IProps {
  Post: ThumbnailObject
  deleteMode: boolean
}

export const ThumbnailCard = ({ Post, deleteMode }: IProps): ReactElement => {
  const { t } = useTranslation();
  const ShowContentFullScreenComponent = createRef<ShowContentFullScreenHandle>();

  return (
    <>
      <ShowContentFullScreen ref={ShowContentFullScreenComponent} />
      <Col xs={6} sm={6} md={4} xl={3} >
        <Card className={Style.Card}>
          <div className={Style.VideoLink}
            onClick={() => {
              ShowContentFullScreenComponent.current?.toggleModal(Post.Id);
            }}>
            {Post.Type !== "Ask" &&
            <div>
                <Img
                  loading="lazy"
                  src={smort.GetImageUrl(Post.Thumbnail ?? Post.File_Id, Post.Thumbnail === null)}
                  className={Style.SquareImage} />

                {deleteMode &&
                 <button className={Style.DeleteButton}
                   onClick={() => {
                     if (Post.Type === "img") {
                       smort.DeleteImage(Post.Id);
                     } else {
                       smort.DeleteVideo(Post.Id)
                     }
                     setTimeout(() => {
                       window.location.reload()
                     }, 1000)
                   }}>
                    <TrashIcon/>
                 </button> }
              </div>
          }
          </div>
        </Card>
      </Col>
    </>)
}