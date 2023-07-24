import { Component } from '@angular/core';

//#region Video Streaming
import { VgApiService } from '@videogular/ngx-videogular/core';
//#endregion

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  preload: string = 'auto';
  api: VgApiService = new VgApiService();

  OnPlayerReady(source: VgApiService) {
    this.api = source;
    this.api
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.AutoPlay.bind(this));
  }

  AutoPlay() {
    this.api.play();
  }
}
