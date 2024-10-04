import { Api } from "./Api";
import { IMyProfile } from "./ApiObjects/userObjects";

export class smortApi {

  public static ApiUrl: string = "http://devilskey.nl/apiSmortSocials";

  private static HttpHeaderContentTypeOnly = {
    "Content-Type": "application/json",
    'Accept': 'text/plain'
  };

  protected static Token: string = "";

  private static HttpHeaderPOST = {
    "Authorization": `Bearer ${this.Token}`,
    "Content-Type": "application/json",
    'Accept': 'text/plain'
  };

  public static Login(email: string, password: string): void {
    Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/Login`,
      { email: email, password: password }, this.HttpHeaderContentTypeOnly)
      .then((response) => response.text())
      .then((token) => {
        this.Token = token;
      });

  }

  public static GetMyProfile(): IMyProfile | null {
    const HttpHeaderGET = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };
    let profile: IMyProfile | null = null;

    Api.SendApiRequestGetAsync(`${this.ApiUrl}/users/GetMyProfile`, HttpHeaderGET)
      .then((response) => {
        profile = response.json();
      });

    return profile;
  }

  public static GetImageUrl(profile_Picture: number) {
    return `${this.ApiUrl}/Images/GetImage?ImageId=${profile_Picture}`
  }
}