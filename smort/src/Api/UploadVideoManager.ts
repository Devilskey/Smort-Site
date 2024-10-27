export class Videomanager {

  public static  data = {
    fileName: "",
    mediaData:  null as string | null,
    title: "",
    description: "",
    Thumbnail:  null as string | null,
  }

  public static setupVideoData(videoTitle:string, videoDescription:string){
      this.data.title = videoTitle;
      this.data.description = videoDescription;
  }

  public static encodeFileToBase64Image(selectVideo: File) {
    if (selectVideo) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          this.data.fileName = selectVideo.name;
          const Image = event.target.result as string;
          const parts = Image.split(',');
          if (parts.length === 2) {
            this.data.Thumbnail = parts[1];
          }
        }
      };
      reader.readAsDataURL(selectVideo);
    }
  }

  public static encodeFileToBase64Video(selectVideo: File) {
    if (selectVideo) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          this.data.fileName = selectVideo.name;
          const Image = event.target.result as string;
          const parts = Image.split(',');
          if (parts.length === 2) {
            this.data.mediaData = parts[1];
          }
        }
      };
      reader.readAsDataURL(selectVideo);
    }
  }
}