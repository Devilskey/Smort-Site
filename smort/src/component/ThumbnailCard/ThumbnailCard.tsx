import { Col, Card } from "react-bootstrap";
import Style from './ThumbnailCard.module.scss'
import { smortApi as smort } from "../../Api/smortApi";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import { createRef } from "react";
import { ShowContentFullScreen, ShowContentFullScreenHandle } from "../Modals/ShowContentFullScreen.Modal";

interface IProps {
  Post: ThumbnailObject
  deleteMode: boolean
}

export const ThumbnailCard = (props: IProps): JSX.Element => {
  const ShowContentFullScreenComponent = createRef<ShowContentFullScreenHandle>();

  return (
    <>
      <ShowContentFullScreen ref={ShowContentFullScreenComponent} />

      <Col xs={6} sm={6} md={4} xl={3} >
        <Card className={Style.Card}>
          <div className={Style.VideoLink}
            onClick={() => {
              ShowContentFullScreenComponent.current?.toggleModal(props.Post.Id);
            }}>
            <img
              loading="lazy"
              src={smort.GetImageUrl(props.Post.Thumbnail !== null ? props.Post.Thumbnail : props.Post.File_Id)}
              className={Style.SquareImage} />
          </div>

          {props.deleteMode &&
            <Card.Footer>
              <button className={Style.DeleteButton}
                onClick={() => {
                  if (props.Post.Type === "img") {
                    smort.DeleteImage(props.Post.Id);
                  } else {
                    smort.DeleteVideo(props.Post.Id)
                  }
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                }}>
                Delete
              </button>
            </Card.Footer>
          }
        </Card>
      </Col>
    </>)
}