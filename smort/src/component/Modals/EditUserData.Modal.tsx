import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap
import { EeditUserType } from '../../Api/enums/EditUserEnum';
import { smortApi as smort } from '../../Api/smortApi';
interface EditUserDataModalProps {
  user?: {
    username: string;
  };
  // Define any other props here
}

interface EditUserDataModalState {
  ShowEditUser: boolean;
  Changeusername: string;
  Changepassword: string;
  ChangeEmail: string;
  DeleteUserName: string;
}

export class EditUserDataModal extends Component<EditUserDataModalProps, EditUserDataModalState> {
  constructor(props: EditUserDataModalProps) {
    super(props);
    this.state = {
      ShowEditUser: false,
      Changeusername: '',
      Changepassword: '',
      ChangeEmail: '',
      DeleteUserName: ''
    };
  }

  ChangeUserData = (typeOfChange: EeditUserType, data: string | File): void => {
    smort.ChangeUserData(data, typeOfChange);
  };

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ Changeusername: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ Changepassword: event.target.value });
  };

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ChangeEmail: event.target.value });
  };

  toggleModal = () => {
    this.setState({ ShowEditUser: !this.state.ShowEditUser });
  };

  render() {
    const { ShowEditUser, Changeusername, Changepassword, ChangeEmail } = this.state;
    const { user } = this.props;

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
              onChange={this.handleUsernameChange}
            />
            <br />
            <button onClick={() => this.ChangeUserData(EeditUserType.UserName, Changeusername)}>
              ChangeUserName
            </button>
            <br />
          </div>

          <div>
            <label htmlFor="ChangePasswordNew">New password: </label>
            <input
              onChange={this.handlePasswordChange}
              id="ChangePasswordNew"
              type="password"
            />
            <br />
            <button onClick={() => this.ChangeUserData(EeditUserType.password, Changepassword)}>
              ChangePassword
            </button>
            <br />
          </div>

          <div>
            <label htmlFor="ChangeEmailNew">New email: </label>
            <input
              onChange={this.handleEmailChange}
              id="ChangeEmailNew"
              type="text"
            />
            <br />
            <button onClick={() => this.ChangeUserData(EeditUserType.Email, ChangeEmail)}>
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
          onChange={(event) => this.setState({DeleteUserName: event.target.value})} />
          <br />
          <Button variant="secondary" onClick={() => {
            smort.DeleteUser(this.state.DeleteUserName);
          }}>
            delete my account
          </Button>
          <Button variant="primary" onClick={this.toggleModal}>
            done
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}