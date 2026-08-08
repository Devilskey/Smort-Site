import React, { Component, forwardRef, JSX, useImperativeHandle, useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import { EeditUserType } from '../../../Api/enums/EditUserEnum';
import { smortApi as smort } from '../../../Api/smortApi';
import { IMyProfile } from '../../../Api/ApiObjects/userObjects';

interface EditUserDataModalProps {
  user: IMyProfile
}

export type EditUserDataModalHandle = {
  toggleModal: () => void;
}

export const EditUserDataModal = forwardRef<EditUserDataModalHandle, EditUserDataModalProps>((props, ref): JSX.Element => {
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

  const { user } = props;

  return (
    <Modal show={ShowEditUser} centered size="lg">
      <Modal.Header>Edit "{user?.username}" your account</Modal.Header>
      <Modal.Body>
        <div>
          <label htmlFor="ChangeUserName">Username: </label>
          <input
            id="ChangeUserName"
            type="text"
            placeholder={user?.username}
            onChange={handleUsernameChange}
          />
          <br />
          <button onClick={() => ChangeUserData(EeditUserType.UserName, Changeusername)}>
            ChangeUserName
          </button>
          <br />
        </div>

        <div>
          <label htmlFor="ChangePasswordNew">New password: </label>
          <input
            onChange={handlePasswordChange}
            id="ChangePasswordNew"
            type="password"
          />
          <br />
          <button onClick={() => ChangeUserData(EeditUserType.password, Changepassword)}>
            ChangePassword
          </button>
          <br />
        </div>

        <div>
          <label htmlFor="ChangeEmailNew">New email: </label>
          <input
            onChange={handleEmailChange}
            id="ChangeEmailNew"
            type="text"
          />
          <br />
          <button onClick={() => ChangeUserData(EeditUserType.Email, ChangeEmail)}>
            ChangeEmail
          </button>
          <br />
        </div>

        <div>
          {/* TODO: Add Change Profile Picture */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <input id="DeleteNameUser" placeholder="Type here your username to confirm"
          onChange={(event) => setDeleteUserName(event.target.value)} />
        <br />
        <Button variant="secondary" onClick={() => {
          smort.DeleteUser(DeleteUserName);
        }}>
          delete my account
        </Button>
        <Button variant="primary" onClick={toggleModal}>
          done
        </Button>
      </Modal.Footer>
    </Modal>
  );

});