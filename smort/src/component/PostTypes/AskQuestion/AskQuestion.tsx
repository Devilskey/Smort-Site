import { ReactElement, useEffect, useState } from "react";

import Style from "./AskQuestion.module.scss";
import { ContentItem } from "../../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../../Api/smortApi";
import { size } from "../../../Api/enums/sizes";
import { Answer } from "../../../Api/ApiObjects/Awnser";
import { useTranslation } from "../../../translations/TranslationProvider";
import { Button } from "react-bootstrap";
import { Img } from "../../../core/ImprovedControls/Img";

interface IAskQuestionProps {
  post: ContentItem
}

export const AskQuestion = ({ post }: IAskQuestionProps): ReactElement => {
  const { t } = useTranslation();
  const [postAnswers, setPostAnswers] = useState<Answer[]>([]);
  const [answer, setAwnser] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    smort.GetAwnser(post.Id).then((awnser) => {
      if (awnser) {
        setPostAnswers(awnser);
      }
    }).catch(console.error)
  }, [])


  const submitAnswer = (): void => {
    setLoading(true);
    const newAnswser = new Answer();
    newAnswser.Answer = answer;
    newAnswser.User_Id = smort.getUser()?.id ?? -1;

    setPostAnswers(prev => [...prev, newAnswser]);

    smort.CreateAnswer(answer, post.Id).then((successfull) => {
      setLoading(false);
      setAwnser("");
    }).catch((error) => {
      setLoading(false);
    })
  }

  return <>
    <div className={Style.ContentQuestion}>
      {(postAnswers.length !== 0) ? postAnswers.map((answer, idx) => (

        <div id={`Ask-${idx}`} className={Style.AnswerBox}>
          <Img className={Style.UserImgSimpel}
            loading="lazy"
            alt="An image Uploaded to smort"
            width="40px" height="40px"
            src={`${smort.GetProfilePictureImageUrl(answer.User_Id)}&size=${size.S}`} />
          {answer.Answer}
        </div>
      )) : <div className={Style.ContentQuestion}>{t('askQuestion.noAnswers')}</div>}

    </div>
    <div className={Style.CreateAnswer}>
      <input
        value={answer}
        onChange={(event) => {
          setAwnser(event.target.value);
        }} />
      <Button
        onClick={submitAnswer}
        disabled={answer === ""}>
        {t('askQuestion.answerButton')}
      </Button>
    </div>
  </>
}