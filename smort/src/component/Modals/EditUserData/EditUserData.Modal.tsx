import React, { Component, forwardRef, ReactElement, useImperativeHandle, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import { EeditUserType } from '../../../Api/enums/EditUserEnum';
import { smortApi as smort } from '../../../Api/smortApi';
import { IMyProfile } from '../../../Api/ApiObjects/userObjects';
import { useTranslation } from '../../../translations/TranslationProvider';
import { AndroidHandler } from '../../../PlatformSpecificScripts/Android';
import Style from "./EditUserData.module.scss";

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

  const { t } = useTranslation();
  const { user } = props;

  return (
    <Modal show={ShowEditUser} centered size="lg" fullscreen={AndroidHandler.IsUsingAndroid() as string | true | undefined}> 
      <Modal.Header className={Style.ModalColor}>{`${t('editAccount.titlePrefix')} "${user?.username}" ${t('editAccount.titleSuffix')}`}</Modal.Header>
      <Modal.Body className={Style.ModalColor}>
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
      </Modal.Body>
      <Modal.Footer className={Style.ModalColor}>

        <Button variant="primary" className={Style.PrimaryButton} onClick={toggleModal}>
          {t('editAccount.done')}
        </Button>
      </Modal.Footer>
    </Modal>
  );

});