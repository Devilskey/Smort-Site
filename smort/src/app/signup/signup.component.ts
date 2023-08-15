import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  Email: String = '';
  Password: String = '';
  UserName: String = '';
  ProfilePicture: String = '';

  SignUp() {}
}
