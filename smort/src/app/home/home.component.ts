import { Component } from '@angular/core';
import { Video, Videos } from '../../assets/videos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  videos = Videos;
  videoIndex = 0;
  currentVideo = this.videos[this.videoIndex];
  data: any;

  OnPlayerReady(data: any) {
    this.data = data;
    this.data
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.AutoPlay.bind(this));
    this.data
      .getDefaultMedia()
      .subscriptions.ended.subscribe(this.NextVideo.bind(this));
    //   this.data
    //     .getDefaultMedia()
    //     .subscriptions.ended.subscribe(this.PreviousVideo.bind(this));
  }

  AutoPlay() {
    this.data.play();
  }

  // PreviousVideo() {
  //   this.videoIndex--;
  //   if (this.videoIndex <= 0) {
  //     this.videoIndex = 0;
  //   }
  //   console.log('previous');
  // console.log(this.videoIndex);
  // console.log(this.videos[this.videoIndex].url);
  // console.log(this.currentVideo);
  // console.log(this.currentVideo.url);
  // }

  NextVideo() {
    this.videos[this.videoIndex] = this.currentVideo;
    this.videoIndex++;
    if (this.videoIndex === this.videos.length) {
      this.videoIndex = 0;
    }
    this.currentVideo = this.videos[this.videoIndex];
    console.log('next');
    console.log(this.videoIndex);
    console.log(this.currentVideo);
    console.log(this.currentVideo.url);
  }

  // get some available videos from people you follow

  // Randomise them

  // Save next video

  // Save previous
  // If there is no previous, don't allow switching to it
}
