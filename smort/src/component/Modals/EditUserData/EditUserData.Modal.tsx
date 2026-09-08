import React, { Component, forwardRef, ReactElement, useContext, useImperativeHandle, useState } from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import { EeditUserType } from '../../../Api/enums/EditUserEnum';
import { smortApi as smort } from '../../../Api/smortApi';
import { IMyProfile } from '../../../Api/ApiObjects/userObjects';
import { useTranslation } from '../../../translations/TranslationProvider';
import { AndroidHandler } from '../../../PlatformSpecificScripts/Android';
import Style from "./EditUserData.module.scss";
import { normalizeLocale } from '../../../translations/translation';
import { useTheme } from '../../../themes/themeProvider';

interface EditUserDataModalProps {
  user: IMyProfile
}

export type EditUserDataModalHandle = {
  toggleModal: () => void;
}

export const EditUserDataModal = forwardRef<EditUserDataModalHandle, EditUserDataModalProps>((props, ref): ReactElement => {
  const [ShowEditUser, setShowEditUser] = useState<boolean>(false)
  const [Changeusername, setChangeusername] = useState<string>("")
  const [Changepassword, setChangepassword] = useState<string>("")
  const [ChangeEmail, setChangeEmail] = useState<string>("")
  const [DeleteUserName, setDeleteUserName] = useState<string>("")
  const [selectedLangauge, setSelectedLanguage] = useState<string>(localStorage.getItem("language") || "en-US");
  const [selectedTheme, setSelectedTheme] = useState<string>(localStorage.getItem("theme")  || "default (dark)");

  const themeArray:{ label: string; value: string }[] = [
    { label: "themes.default (dark)", value: "default (dark)" },
    { label: "themes.light", value: "Light" },
    { label: "themes.pony", value: "Pony" },
    { label: "themes.Samurai", value: "Samurai" }
  ];

    const langArray:{ label: string; value: string }[] = [
    { label: "langs.NL", value: "nl-nl" },
    { label: "langs.EN", value: "en-us" },
  ];

  const { theme, setTheme } = useTheme();
  const { t, setLocale } = useTranslation();
  const { user } = props;


  useImperativeHandle(ref, () => ({
    toggleModal,
  }));


  const ChangeUserData = (typeOfChange: EeditUserType, data: string | File): void => {
    smort.ChangeUserData(data, typeOfChange);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeusername(event.target.value)
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangepassword(event.target.value)
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeEmail(event.target.value)
  };

  const toggleModal = () => {
    setShowEditUser(!ShowEditUser)
  };

  const selectLangauge = (lang: string) => {
    localStorage.setItem("language", lang);
    setSelectedLanguage(lang)
    setLocale(normalizeLocale(lang));
  }

  const selectTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    setSelectedTheme(theme);
    setTheme(theme);
  }

  return (
    <Modal show={ShowEditUser} centered size="lg" fullscreen={AndroidHandler.IsUsingAndroid() as string | true | undefined}> 
      <Modal.Header className={Style.ModalColor}>{`${t('editAccount.titlePrefix')} "${user?.username}" ${t('editAccount.titleSuffix')}`}</Modal.Header>
      <Modal.Body className={Style.ModalColor}>
        <h3>{t('editAccount.titleSettings')}</h3>

        <div className={Style.Form}>
          <Dropdown onSelect={(eventKey) => selectLangauge(eventKey || "en-US")}>
            <Dropdown.Toggle variant="success" id="dropdown-lang">
              {t(`editAccount.selectedLanguage`)}: {selectedLangauge === "nl-nl" ? t('langs.NL') : t('langs.EN')}
            </Dropdown.Toggle>
     
            <Dropdown.Menu>
              {langArray.map((lang) => (
                <Dropdown.Item eventKey={lang.value} key={lang.value}>
                  {t(`${lang.label}`)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className={Style.Form}>
          <Dropdown onSelect={(eventKey) => selectTheme(eventKey || "default (dark)")}>
            <Dropdown.Toggle variant="success" id="dropdown-theme">
              {t(`editAccount.selectedTheme`)}: {selectedTheme}
            </Dropdown.Toggle>
    
            <Dropdown.Menu>
              {themeArray.map((theme) => (
                <Dropdown.Item eventKey={theme.value} key={theme.value}>
                  {t(`${theme.label}`)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <hr/>
        <h3>{t('editAccount.titleAccountData')}</h3>
        <div className={Style.Form}>
          <label htmlFor="ChangeUserName">{t('editAccount.usernameLabel')}</label>
          <input
            id="ChangeUserName"
            type="text"
            placeholder={user?.username}
            onChange={handleUsernameChange}
          />
          <br />
          <Button onClick={() => ChangeUserData(EeditUserType.UserName, Changeusername)}>
            {t('editAccount.changeUsernameBtn')}
          </Button>
          <br />
        </div>

        <div className={Style.Form}>
          <label htmlFor="ChangePasswordNew">{t('editAccount.passwordLabel')}</label>
          <input
            onChange={handlePasswordChange}
            id="ChangePasswordNew"
            type="password"
          />
          <br />
          <Button onClick={() => ChangeUserData(EeditUserType.password, Changepassword)}>
            {t('editAccount.changePasswordBtn')}
          </Button>
          <br />
        </div>

        <div className={Style.Form}>
          <label htmlFor="ChangeEmailNew">{t('editAccount.emailLabel')}</label>
          <input
            onChange={handleEmailChange}
            id="ChangeEmailNew"
            type="text"
          />
          <br />
          <Button onClick={() => ChangeUserData(EeditUserType.Email, ChangeEmail)}>
            {t('editAccount.changeEmailBtn')}
          </Button>
          <br />
        </div>


        <input className={Style.DeleteMeInputField} id="DeleteNameUser" placeholder={t('editAccount.confirmDeletePlaceholder')}
          onChange={(event) => setDeleteUserName(event.target.value)} />
        <Button variant="secondary" className={Style.SecondaryButton}  onClick={() => {
          smort.DeleteUser(DeleteUserName);
        }}>
          {t('editAccount.deleteAccount')}
        </Button>

        <div>
          {/* TODO: Add Change Profile Picture */}
        </div>

        <hr/>

      </Modal.Body>




      <Modal.Footer className={Style.ModalColor}>

        <Button variant="primary" className={Style.PrimaryButton} onClick={toggleModal}>
          {t('editAccount.done')}
        </Button>
      </Modal.Footer>
    </Modal>
  );

});