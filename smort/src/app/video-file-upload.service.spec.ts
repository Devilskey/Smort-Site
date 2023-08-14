import { TestBed } from '@angular/core/testing';

import { VideoFileUploadService } from './video-file-upload.service';

describe('VideoFileUploadService', () => {
  let service: VideoFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
