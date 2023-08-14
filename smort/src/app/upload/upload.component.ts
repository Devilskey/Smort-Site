import { Component, OnInit } from '@angular/core';

import { VideoFileUploadService } from '../video-file-upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  // Inject service
  constructor(private VideoFileUploadService: VideoFileUploadService) {}

  ngOnInit(): void {}

  VideoTitle: String = '';
  VideoDescription: String = '';
  VideoFile: String = '';

  // Variable to store shortLink from api response
  shortLink: string = '';
  loading: boolean = false; // Flag variable
  file: File = null; // Variable to store file

  // On file Select
  onChange(event) {
    this.file = event.target.files[0];
  }

  UploadVideo() {
    // API request to POST video file
    this.loading = !this.loading;
    console.log(this.file);
    this.VideoFileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof event === 'object') {
        // Short link via api response
        this.shortLink = event.link;

        this.loading = false; // Flag variable
      }
    });
    // API request to POST video with title and description
    // Send this.VideoTitle, this.VideoDescription, this.VideoFile,
  }
}
