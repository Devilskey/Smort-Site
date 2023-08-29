import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  UserName: String = '';
  Email: String = '';
  Password: String = '';
  ProfilePicture: String = '';
  FollowerTitle: String = '';
  EmailNotiffications: Boolean = false;

  toggle(): void {}

  SaveSettings() {
    console.log(this.EmailNotiffications);
  }
}
