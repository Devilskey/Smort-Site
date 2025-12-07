import { ReactElement, useEffect, useState } from "react";

import Style from "./AskQuestion.module.scss";
import { ContentItem } from "../../../Api/ApiObjects/ContentObject";
import { smortApi as smort } from "../../../Api/smortApi";
import { size } from "../../../Api/enums/sizes";
import { Answer } from "../../../Api/ApiObjects/Awnser";

interface IAskQuestionProps {
  post: ContentItem
}


export const AskQuestion = ({ post }: IAskQuestionProps): ReactElement => {
  const [postAnswers, setPostAnswers] = useState<Answer[]>([]);
  const [answer, setAwnser] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log(postAnswers);
  }, [postAnswers, loading, answer])

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
      console.log(error);
    })
  }

  return <>
    <div className={Style.ContentQuestion}>
      {(postAnswers.length !== 0) ? postAnswers.map((answer, idx) => (

        <div  id={`Ask-${idx}`} className={Style.AnswerBox}> <img className={Style.UserImgSimpel}
          loading="lazy"
          alt="An image Uploaded to smort"
          width="40px" height="40px"
          src={`${smort.GetProfilePictureImageUrl(answer.User_Id)}&size=${size.S}`} />
          {answer.Answer}
        </div>
      )) : <div className={Style.ContentQuestion}> NO answers where given</div>}

    </div>
    <div className={Style.CreateAnswer}>
      <input
        value={answer}
        onChange={(event) => {
          setAwnser(event.target.value);
        }} />
      <button
        onClick={submitAnswer}
        disabled={answer === ""}>
        answer
      </button>
    </div>
  </>
}