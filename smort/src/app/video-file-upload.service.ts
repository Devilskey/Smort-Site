import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoFileUploadService {
  // API url
  APIURL = 'https://file.io';

  constructor(private http: HttpClient) {}

  // Returns an observable
  upload(file): Observable<any> {
    // Create form data
    const FormData = new FormData();

    // Store form name as "file" with file data
    FormData.append('file', file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.APIURL, FormData);
  }
}
