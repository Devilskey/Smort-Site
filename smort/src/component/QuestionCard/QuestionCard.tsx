import { Col, Card } from "react-bootstrap";
import Style from './QuestionCard.module.scss'
import { smortApi as smort } from "../../Api/smortApi";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import { createRef, ReactElement } from "react";
import { useTranslation } from "../../translations/TranslationProvider";
import { ShowContentFullScreen, ShowContentFullScreenHandle } from "../Modals/ShowContentFullScreen/ShowContentFullScreen.Modal";
import { QuestionSignIcon, TrashIcon } from "../../core/Icon";
import { Img } from "../../core/ImprovedControls/Img";

interface IProps {
  Post: ThumbnailObject
  deleteMode: boolean
}

export const QuestionCard = ({ Post, deleteMode }: IProps): ReactElement => {
  const { t } = useTranslation();
  const ShowContentFullScreenComponent = createRef<ShowContentFullScreenHandle>();

  return (
    <>
      <ShowContentFullScreen ref={ShowContentFullScreenComponent} />
      <Col xs={6} sm={6} md={4} xl={3} >
        <Card className={Style.Card}>

          <div className={Style.Question}>
            {/* <div className={Style.QuestionBG}>
              <QuestionSignIcon/>
              <QuestionSignIcon/>
              <QuestionSignIcon/>
            </div> */}
            <div  className={Style.QuestionText}>
              {Post.description}               {Post.description}               {Post.description} {Post.description} 
              </div>
          </div>

           {deleteMode &&
            <button className={Style.DeleteButton}
              onClick={() => {
                if (Post.type === "img") {
                  smort.DeleteImage(Post.id);
                } else {
                  smort.DeleteVideo(Post.id)
                }
                setTimeout(() => {
                  window.location.reload()
                }, 1000)
              }}>
               <TrashIcon/>
            </button> 
            }
        </Card>
      </Col>
    </>)
}