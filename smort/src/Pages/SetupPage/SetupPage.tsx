import { ReactElement, useRef, useState } from "react";

import Style from "./SetupPage.module.scss";
import { useTranslation } from "../../translations/TranslationProvider";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import { Row } from "react-bootstrap";

import { smortApi as smort } from "../../Api/smortApi";
import { auth } from "../../configs/FirebaseConfig";
import { Img } from "../../core/ImprovedControls/Img";

export const SetupPage = (): ReactElement => { 
    const { t } = useTranslation();
    const inputRefrence = useRef<HTMLInputElement>(null)
    const [ProfilePicture, setProfilePicture] = useState<File | null>(null);
    const [username, setUsername] = useState("");

    const SumbitData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(auth.currentUser?.email && (ProfilePicture && username)){
            await smort.ConfigureAccountAsync(auth.currentUser?.email, ProfilePicture, username);
        }
    }

    return (
        <div className={Style.page}>
            <div className={Style.Information}>
                <h1>{t('setup.title')}</h1>
                <p>{t('setup.description')}</p>
            </div>
            <div className={Style.SetupForm}>
                <Form>
                    <Form.Group as={Row}>
                        <Col>
                          <input
                            type="file"
                            placeholder="enter email"
                            hidden
                            onChange={(Element) => {
                              setProfilePicture(Element.target.files?.[0] || null)

                            }}
                            ref={inputRefrence} />

                          <div className={Style.ProfilePictureAddDiv}>
                            <Button
                              className={Style.PfPicture}
                              onClick={() => {
                                inputRefrence.current?.click()
                              }}>
                              {ProfilePicture ? (<Img src={URL.createObjectURL(ProfilePicture)} />) : (<div> + </div>)}
                            </Button>
                          </div>
                        </Col>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label/>
                        <Form.Control 
                            type="text" 
                            placeholder={t('setup.usernamePlaceholder')} 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Button 
                        onClick={async (e) => await SumbitData(e as any)}
                        variant="primary" type="submit" className={Style.SubmitButton}>
                        {t('setup.buttonSubmit')}
                    </Button>
                </Form>
            </div>
        </div>
    );
}