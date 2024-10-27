import { Api } from "./Api";
import { ThumbnailObject } from "./ApiObjects/ThumbnailObjects";
import { IMyProfile } from "./ApiObjects/userObjects";
import { Video } from "./ApiObjects/VideoObject";
import { Videomanager } from "./UploadVideoManager";

export class smortApi {

  public static ApiUrl: string = "https://devilskey.nl/apiSmortSocials";
  protected static User: IMyProfile;
  protected static Token: string | null = null;
  protected static LoggedIn: boolean = false;

  public static getUser(): IMyProfile | undefined {
    if (this.User !== null) {
      return this.User;
    }
    return undefined;
  }

  public static IsLogedIn(): boolean {
    console.log(`[${this.Token}]`)
    if (this.Token === "Data received Empty") {
      return false;
    }
    if (this.Token !== null) {
      return true;
    }
    return false;
  }

  public static async LoginAsync(email: string, password: string): Promise<void> {
    const httpHeader = {
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };

    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/Login`,
      { email: email, password: password }, httpHeader)
      .then((response) => response.text())
      .then((token) => {
        this.Token = token;
        if (this.Token === "Data received Empty") {
          this.LoggedIn = true;
        }
      });
  }

  public static async GetMyProfileAsync(): Promise<IMyProfile> {

    if (this.User !== undefined) {
      return this.User;
    }

    const HttpHeaderGET = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };

    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/users/GetMyProfile`, HttpHeaderGET)
      .then(async (response) => {
        const jsonData: IMyProfile = await response.json();
        console.log(jsonData)
        this.User = jsonData;
      });
    return this.User;
  }
  public static async GetProfileAsync(id:number): Promise<IMyProfile> {

    let dataUser: IMyProfile = {
      username: "",
      profile_Picture: 0
    };

    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/users/GetUserDataProfile?id=${id}`)
      .then(async (response) => {
        const jsonData: any[]= await response.json();
        console.log(jsonData)
        dataUser.username = jsonData[0].Username;
        dataUser.profile_Picture = jsonData[0].Profile_Picture;

      });

    return dataUser;
  }

  public static GetImageUrl(profile_Picture?: number) {
    if (profile_Picture) {
      return `${this.ApiUrl}/Images/GetImage?ImageId=${profile_Picture}`
    }
    return `${this.ApiUrl}/Images/GetImage?ImageId=${this.User?.profile_Picture}`
  }

  public static async GetVideoListAsync(): Promise<Video[]> {
    let videos: Video[] = [];
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Video/GetVideoList`)
      .then(async (response) => {
        const jsonData: Video[] = await response.json();
        console.log(jsonData);
        videos = jsonData;
      });
    return videos;
  }

  public static async GetThumbnail(userId: number): Promise<ThumbnailObject[]> {
    let thumbnailData: ThumbnailObject[] = []
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Video/GetThumbnailUserList?id=${userId}`).then(async (response) => {
      const jsonData: ThumbnailObject[] = await response.json();
      thumbnailData = jsonData;
    }).catch((error) => console.log(error))
    return thumbnailData;
  }

  public static async GetMyThumbnail(): Promise<ThumbnailObject[]> {

    const HttpHeaderGET = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };


    let thumbnailData: ThumbnailObject[] = []
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Video/GetMyThumbnail`, HttpHeaderGET).then(async (response) => {
      const jsonData: ThumbnailObject[] = await response.json();
      thumbnailData = jsonData;
    }).catch((error) => console.log(error))

    return thumbnailData;
  }

  public static GetVideoUrl(VideoId: number) {
    return `${this.ApiUrl}/Video/GetVideo?videoId=${VideoId}`
  }

  public static async UploadVideo(){
    const HttpHeaderPost = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };
    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/Videos/UploadVideo`, Videomanager.data, HttpHeaderPost)
  }
}
