import { Component } from '@angular/core';
import { Profile, Profiles } from '../../assets/placeholder-data-profiles';
import { Video, Videos } from '../../assets/placeholder-data-videos';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profiles = Profiles;
  videos = Videos;
}
