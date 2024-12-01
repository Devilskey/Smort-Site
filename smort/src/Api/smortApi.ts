import { publicDecrypt, randomUUID } from "crypto";
import { Api } from "./Api";
import { ThumbnailObject } from "./ApiObjects/ThumbnailObjects";
import { IMyProfile } from "./ApiObjects/userObjects";
import { Video } from "./ApiObjects/VideoObject";
import Cookies from 'js-cookie';
import { PostImage } from "./ApiObjects/PostImageObjects";

export class smortApi {

  public static ApiUrl: string = "https://devilskey.nl/apiSmortSocials";
  //public static ApiUrl: string = "https://localhost:7047";

  protected static User: IMyProfile;
  protected static Token: string | null = null;
  protected static LoggedIn: boolean = false;

  public static LoadCookies(): void {
    this.Token = Cookies.get("jwtToken") ?? null;
  }


  public static getUser(): IMyProfile | undefined {
    if (this.User !== null) {
      return this.User;
    }
    return undefined;
  }

  public static IsLogedIn(): boolean {
    this.LoadCookies();
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
        if (this.Token !== "Data received Empty") {
          this.LoggedIn = true;
          if (typeof this.Token === 'string') {
            Cookies.set("jwtToken", this.Token)
          }
        }
      });
  }

  public static async CreateAccountAsync(email: string, password: string, Profile_Picture: File, Username: string) {
    const httpHeader = {
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };

    if (!email || !password || !Username || !Profile_Picture) {
      return;
    }

    const reader = new FileReader();

    let base64Pf = "";

    reader.onload = async (event) => {
      if (event.target?.result) {
        const image = event.target.result as string;
        const parts = image.split(',');
        if (parts.length === 2) {
          await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/CreateAccount`,
            { email: email, password: password, username: Username, profilePicture: parts[1] }, httpHeader);

        }
      }
    }

    reader.readAsDataURL(Profile_Picture);

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
  public static async GetProfileAsync(id: number): Promise<IMyProfile> {

    let dataUser: IMyProfile = {
      username: "",
      profile_Picture: 0
    };

    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/users/GetUserDataProfile?id=${id}`)
      .then(async (response) => {
        const jsonData: any[] = await response.json();
        console.log(jsonData)
        dataUser.username = jsonData[0].Username;
        dataUser.profile_Picture = jsonData[0].Profile_Picture;

      });

    return dataUser;
  }

  public static GetProfilePictureImageUrl(UserId: number) {
    return `${this.ApiUrl}/Images/GetUsersProfileImage?UserId=${UserId}`
  }

  public static GetImageUrl(profile_Picture?: number) {
    if (profile_Picture) {
      return `${this.ApiUrl}/Images/GetImage?ImageId=${profile_Picture}`
    }
    return `${this.ApiUrl}/Images/GetImage?ImageId=${this.User?.profile_Picture}`
  }

  public static async GetImageAsync(imageId: string): Promise<PostImage[]> {
    let images: PostImage[] = [];
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/ImagePosts/GetImageFromId?id=${imageId}`)
      .then(async (response) => {
        const jsonData: PostImage[] = await response.json();
        console.log(jsonData);
        images = jsonData;
      });
    return images;
  }


  public static async GetVideoAsync(videoId: string): Promise<Video[]> {
    let videos: Video[] = [];
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Video/GetVideoFromId?id=${videoId}`)
      .then(async (response) => {
        const jsonData: Video[] = await response.json();
        console.log(jsonData);
        videos = jsonData;
      });
    return videos;
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

  public static async GetListImagePost() {
    let postImages: PostImage[] = [];
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/ImagePosts/GetImagePosts`)
      .then(async (response) => {
        const jsonData: PostImage[] = await response.json();
        console.log(jsonData);
        postImages = jsonData;
      });
    return postImages;
  }

  public static async GetUsersContent(userId: number): Promise<ThumbnailObject[]> {
    let thumbnailData: ThumbnailObject[] = []
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Posts/GetAccountContentList?idUser=${userId}`).then(async (response) => {
      const jsonData: ThumbnailObject[] = await response.json();
      thumbnailData = jsonData;
    }).catch((error) => console.log(error))
    return thumbnailData;
  }

  public static async GetMyContent(): Promise<ThumbnailObject[]> {

    const HttpHeaderGET = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };


    let thumbnailData: ThumbnailObject[] = []
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Posts/GetAccountContentList`, HttpHeaderGET).then(async (response) => {
      const jsonData: ThumbnailObject[] = await response.json();
      thumbnailData = jsonData;
    }).catch((error) => console.log(error))

    return thumbnailData;
  }

  public static GetVideoUrl(VideoId: number) {
    return `${this.ApiUrl}/Video/GetVideo?videoId=${VideoId}`
  }

  public static async GetFollowersAsync(UserId: string): Promise<string> {
    const HttpHeaderPost = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };
    let followersAmount = "0";

    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/FollowersAmount?id=${UserId}`, null, HttpHeaderPost)
      .then(async (response) => {
        const jsonData: string = await response.text();
        followersAmount = jsonData;
      })
    return followersAmount;
  }

  public static async GetMyFollowersAsync(): Promise<string> {
    const HttpHeaderGet = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };
    let followersAmount = "0";

    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/users/MyFollowersAmount`, HttpHeaderGet)
      .then(async (response) => {
        const jsonData: string = await response.text();
        followersAmount = jsonData;
      })
    return followersAmount;
  }

  public static async GetSearchResultsImagePostAsync(Search: string): Promise<PostImage[]> {
    let images: PostImage[] = [];

    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/ImagePosts/SearchImagePost?Search=${Search}`)
      .then(async (response) => {
        const jsonData: PostImage[] = await response.json();
        console.log(jsonData);
        images = jsonData;
      });

    return images;
  }

  public static async GetSearchResultsAsync(Search: string): Promise<Video[]> {
    let videos: Video[] = [];

    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Video/SearchVideo?Seach=${Search}`)
      .then(async (response) => {
        const jsonData: Video[] = await response.json();
        console.log(jsonData);
        videos = jsonData;
      });

    return videos;
  }

  public static async FollowUser(IdUserToFollow: string) {
    const HttpHeaderPost = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };

    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/FollowUser?id=${IdUserToFollow}`, null, HttpHeaderPost)
  }


  public static async AlreadyFollowing(IdUserToFollow: string) {
    const HttpHeaderPost = {
      "Authorization": `Bearer ${this.Token}`,
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };
    var following = false
    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/AlreadyFollowing?id=${IdUserToFollow}`, null, HttpHeaderPost).then((response) => response.json())
      .then((isSuccessful) => {
        following = isSuccessful
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      return following;
  }

  public static async UnfollowUser(IdUserToFollow: string) {
    const HttpHeaderPost = {
      "Authorization": `Bearer ${this.Token}`,
      "responseType": "text",
    };
    await Api.SendApiRequestWithHeaderDeleteAsync(`${this.ApiUrl}/users/UnFollowUser?creatorId=${IdUserToFollow}`, HttpHeaderPost)
  }

  public static async UploadPostImage (image: File | null, title: string, description: string){
    if (!title || !description || !image) {
      console.log("ERROR Empty" + !title  + " : " + !description + " : " + !image)
      console.log(image)

      return;
    }
    var UUIDApiCall = crypto.randomUUID();

    const chunkSize = (1024 * 1024) * 20;
    const totalChunks = Math.ceil(image.size / chunkSize);

    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      let start = chunkNumber * chunkSize;
      let end = Math.min(start + chunkSize, image.size);
      let chunk = image.slice(start, end);

      const reader = new FileReader();

      reader.readAsDataURL(chunk);
      reader.onload = async () => {
        const base64Chunk = reader.result?.toString().split(',')[1];

        const payload = {
          Title: title,
          MediaData: base64Chunk,
          GUIDObjSender: UUIDApiCall,
          Description: description,
          ChunkNumber: chunkNumber,
          TotalChunks: totalChunks,
        };
        const HttpHeaderPost = {
          "Authorization": `Bearer ${this.Token}`,
          "Content-Type": "application/json",
          'Accept': 'text/plain'
        };

        try {
          await Api.SendApiRequestPostAsync(`${this.ApiUrl}/ImagePosts/CreateNewPost`, payload, HttpHeaderPost);
        } catch (error) {
          console.error(`Error uploading chunk ${chunkNumber}:`, error);
          return;
        }
      };
    }
  }

  public static async UploadVideo(video: File | null, thumbnail: File | null, title: string, description: string) {

    if (!title || !description || !video || !thumbnail) {
      return;
    }

    var UUIDApiCall = crypto.randomUUID();
    console.log(thumbnail)

    const chunkSize = (1024 * 1024) * 20;
    const totalChunks = Math.ceil(video.size / chunkSize);

    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      let start = chunkNumber * chunkSize;
      let end = Math.min(start + chunkSize, video.size);
      let chunk = video.slice(start, end);

      const reader = new FileReader();

      let base64Thumbnail = "";

      if (thumbnail) {
        const thumbnailReader = new FileReader();
        thumbnailReader.onload = (event) => {
          if (event.target?.result) {
            const Image = event.target.result as string;
            const parts = Image.split(',');
            if (parts.length === 2) {
              base64Thumbnail = parts[1];
            }
          }
        };
        thumbnailReader.readAsDataURL(thumbnail);
      }

      reader.readAsDataURL(chunk);
      reader.onload = async () => {
        const base64Chunk = reader.result?.toString().split(',')[1];

        const payload = {
          GUIDObjSender: UUIDApiCall,
          MediaData: base64Chunk,
          Thumbnail: base64Thumbnail,
          FileName: video.name,
          ChunkNumber: chunkNumber,
          TotalChunks: totalChunks,
          Title: title,
          Description: description,
        };

        console.log(payload)
        console.log("payload", payload.GUIDObjSender)

        const HttpHeaderPost = {
          "Authorization": `Bearer ${this.Token}`,
          "Content-Type": "application/json",
          'Accept': 'text/plain'
        };

        try {
          await Api.SendApiRequestPostAsync(`${this.ApiUrl}/Videos/UploadVideo`, payload, HttpHeaderPost);
        } catch (error) {
          console.error(`Error uploading chunk ${chunkNumber}:`, error);
          return;
        }
      };
    }
  }
}