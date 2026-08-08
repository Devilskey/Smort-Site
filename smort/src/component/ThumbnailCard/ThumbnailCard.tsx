import { Col, Card } from "react-bootstrap";
import Style from './ThumbnailCard.module.scss'
import { smortApi as smort } from "../../Api/smortApi";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import { createRef, JSX } from "react";
import { ShowContentFullScreen, ShowContentFullScreenHandle } from "../Modals/ShowContentFullScreen/ShowContentFullScreen.Modal";

interface IProps {
  Post: ThumbnailObject
  deleteMode: boolean
}

export const ThumbnailCard = ({ Post, deleteMode }: IProps): JSX.Element => {
  const ShowContentFullScreenComponent = createRef<ShowContentFullScreenHandle>();

  console.log(Post);
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
              <img
                loading="lazy"
                src={smort.GetImageUrl(Post.Thumbnail ?? Post.File_Id, Post.Thumbnail === null)}
                className={Style.SquareImage} />}
          </div>

          {deleteMode &&
            <Card.Footer>
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
                Delete
              </button>
            </Card.Footer>
          }
        </Card>
      </Col>
    </>)
}