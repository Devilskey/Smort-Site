import { Api } from "./Api";
import { IMyProfile } from "./ApiObjects/userObjects";
import { Video } from "./ApiObjects/VideoObject";

export class smortApi {

  public static ApiUrl: string = "http://devilskey.nl/apiSmortSocials";
  protected static User: IMyProfile;
  protected static Token: string | null = null;
  protected static LoggedIn: boolean = false;

  public static getUser():IMyProfile | undefined {
    if (this.User !== null) {
      return this.User;
    }
    return undefined;
  }

  public static IsLogedIn(): boolean {
    if(!this.LoggedIn){
      return false;
    }

    console.log(`[${this.Token}]`)
    if (this.Token === "Data received Empty") {
      return false;
    }
   if(this.Token !== null){
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

    if(this.User !== undefined){
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

  public static GetImageUrl(profile_Picture?: number) {
    if (profile_Picture) {
      return `${this.ApiUrl}/Images/GetImage?ImageId=${profile_Picture}`
    }
    return `${this.ApiUrl}/Images/GetImage?ImageId=${this.User?.profile_Picture}`
  }

  public static async GetVideoListAsync(): Promise<Video[]> {
    let videos:Video[] = [];
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Video/GetVideoList`)
      .then(async (response) => {
        const jsonData: Video[] = await response.json();
        console.log(jsonData);
        videos = jsonData;
      });
      return videos;
  }

  public static GetVideoUrl(VideoId: number){
    return `${this.ApiUrl}/Video/GetVideo?videoId=${VideoId}`
  }
}
