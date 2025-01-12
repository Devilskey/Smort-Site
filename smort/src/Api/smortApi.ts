import { publicDecrypt, randomUUID } from "crypto";
import { Api } from "./Api";
import { ThumbnailObject } from "./ApiObjects/ThumbnailObjects";
import { IMyProfile } from "./ApiObjects/userObjects";
import { Video } from "./ApiObjects/VideoObject";
import Cookies from 'js-cookie';
import { PostImage } from "./ApiObjects/PostImageObjects";
import { EeditUserType } from "./enums/EditUserEnum";
import { ErrorHandler } from "./Logging";
import { httpHeaders } from "./httpHeaders"
export class smortApi {

  public static ApiUrl: string =  "https://devilskey.nl/apiSmortSocials"; //"https://localhost:7047";

  protected static User: IMyProfile;
  protected static Token: string | null = null;
  protected static LoggedIn: boolean = false;

  public static LoadCookies(): void {
    this.Token = Cookies.get("jwtToken") ?? null;
  }

  public static SetUpApiUrl() {
    if (window.location.hostname.includes("devilskey.nl") ||
      window.location.hostname.includes("smorthub.nl")) {
      this.ApiUrl = "https://devilskey.nl/apiSmortSocials";
      return;
    }
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

  public static async LoginAsync(email: string, password: string): Promise<boolean> {
    const httpHeader = {
      "Content-Type": "application/json",
      'Accept': 'text/plain'
    };

    let IsLoggedIn = false;

    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/Login`,
      { email: email, password: password }, httpHeader)
      .then((response) => response.text())
      .then((token) => {
        this.Token = token;
        if (this.Token !== "Data received Empty" && this.Token !== "Already an account using this Email") {
          IsLoggedIn = true;
          if (typeof this.Token === 'string') {
            Cookies.set("jwtToken", this.Token)
          }
        }
      });
    return IsLoggedIn;
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
    const img = new Image();

    reader.onload = async (event) => {
      if (event.target?.result) {
        const image = event.target.result as string;
        const parts = image.split(',');

        if (parts.length === 2) {
          img.onload = async () => {
            await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/CreateAccount`, {
              email: email,
              password: password,
              username: Username,
              profilePicture: parts[1],
              size: {
                Width: img.width,
                Height: img.height
              },
            }, httpHeader);
          };

          img.src = URL.createObjectURL(Profile_Picture);
        }
      }
    };

    reader.readAsDataURL(Profile_Picture);
  }

  public static async GetMyProfileAsync(): Promise<IMyProfile> {
    if (this.User !== undefined) {
      return this.User;
    }
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/users/GetMyProfile`,
      httpHeaders.httpHeaderJsonWithToken(this.Token))
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
    if (this.Token !== null) {

      await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/ImagePosts/GetImageFromId?id=${imageId}`,
        httpHeaders.httpHeaderJsonWithToken(this.Token))
        .then(async (response) => {
          const jsonData: PostImage[] = await response.json();
          console.log(jsonData);
          images = jsonData;
        });
      return images;

    }
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
    if (this.Token !== null) {


      await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Video/GetVideoList`,
        httpHeaders.httpHeaderJsonWithToken(this.Token))
        .then(async (response) => {
          const jsonData: Video[] = await response.json();
          console.log(jsonData);
          videos = jsonData;
        });
      return videos;
    }

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
    if (this.Token !== null) {
      await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/ImagePosts/GetImagePosts`,
        httpHeaders.httpHeaderJsonWithToken(this.Token))
        .then(async (response) => {
          const jsonData: PostImage[] = await response.json();
          console.log(jsonData);
          postImages = jsonData;
        });
      return postImages;
    }

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
    let thumbnailData: ThumbnailObject[] = []
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Posts/GetAccountContentList`,
      httpHeaders.httpHeaderJsonWithToken(this.Token)).then(async (response) => {

        const jsonData: ThumbnailObject[] = await response.json();
        thumbnailData = jsonData;
      }).catch((error) => console.log(error))

    return thumbnailData;
  }

  public static GetVideoUrl(VideoId: number) {
    return `${this.ApiUrl}/Video/GetVideo?videoId=${VideoId}`
  }

  public static async GetFollowersAsync(UserId: string): Promise<string> {

    let followersAmount = "0";

    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/FollowersAmount?id=${UserId}`, null,
      httpHeaders.httpHeaderJsonWithToken(this.Token))
      .then(async (response) => {
        const jsonData: string = await response.text();
        followersAmount = jsonData;
      })
    return followersAmount;
  }

  public static async GetMyFollowersAsync(): Promise<string> {

    let followersAmount = "0";

    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/users/MyFollowersAmount`,
      httpHeaders.httpHeaderJsonWithToken(this.Token))
      .then(async (response) => {
        const jsonData: string = await response.text();
        followersAmount = jsonData;
      })
    return followersAmount;
  }

  public static async GetSearchResultsImagePostAsync(Search: string): Promise<PostImage[]> {
    let images: PostImage[] = [];
    if (this.Token !== null) {
      await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/ImagePosts/SearchImagePost?Search=${Search}`,
        httpHeaders.httpHeaderJsonWithToken(this.Token))
        .then(async (response) => {
          const jsonData: PostImage[] = await response.json();
          console.log(jsonData);
          images = jsonData;
        });
      return images;
    }

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

    if (this.Token !== null) {
      await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Video/SearchVideo?Seach=${Search}`,
        httpHeaders.httpHeaderJsonWithToken(this.Token))
        .then(async (response) => {
          const jsonData: Video[] = await response.json();
          console.log(jsonData);
          videos = jsonData;
        });
      return videos;
    }


    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Video/SearchVideo?Seach=${Search}`)
      .then(async (response) => {
        const jsonData: Video[] = await response.json();
        console.log(jsonData);
        videos = jsonData;
      });

    return videos;
  }

  public static async FollowUser(IdUserToFollow: string) {
    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/FollowUser?id=${IdUserToFollow}`, null,
      httpHeaders.httpHeaderJsonWithToken(this.Token)
    )
  }


  public static async AlreadyFollowing(IdUserToFollow: string) {

    var following = false
    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/AlreadyFollowing?id=${IdUserToFollow}`, null,
      httpHeaders.httpHeaderJsonWithToken(this.Token)).then((response) => response.json())
      .then((isSuccessful) => {
        following = isSuccessful
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    return following;
  }

  public static async UnfollowUser(IdUserToFollow: string) {
    await Api.SendApiRequestWithHeaderDeleteAsync(`${this.ApiUrl}/users/UnFollowUser?creatorId=${IdUserToFollow}`,
      httpHeaders.httpHeaderWithToken(this.Token))
  }

  public static async UploadPostImage(image: File | null, title: string, description: string): Promise<Boolean> {
    if (!title || !description || !image) {
      console.log("ERROR Empty" + !title + " : " + !description + " : " + !image)
      console.log(image)

      return false;
    }
    return new Promise((resolve, reject) => {
      let chunkUploadSuccessful = true;
      var UUIDApiCall = crypto.randomUUID();

      const chunkSize = (1024 * 1024) * 20;
      const totalChunks = Math.ceil(image.size / chunkSize);

      const img = new Image();
      let width = 0;
      let height = 0;

      img.onload = () => {
        width = img.width;
        height = img.height;

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
              size: {
                Width: width,
                Height: height
              },
              GUIDObjSender: UUIDApiCall,
              Description: description,
              ChunkNumber: chunkNumber,
              TotalChunks: totalChunks,
            };

            try {
              await Api.SendApiRequestPostAsync(`${this.ApiUrl}/ImagePosts/CreateNewPost`, payload, httpHeaders.httpHeaderJsonWithToken(this.Token))
                .then(async response => {
                  if (await response.text() === "Saved the new Post" && response.ok) {
                    resolve(true);
                  }
                });

            } catch (error) {
              console.error(`Error uploading chunk ${chunkNumber}:`, error);
              reject(false);
            }
          };
        }
      }
      img.src = URL.createObjectURL(image);
    });
  }


  public static async UploadVideo(video: File | null, thumbnail: File | null, title: string, description: string):Promise<boolean> {

    return new Promise((resolve, reject) => {

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

        let width = 0;
        let height = 0;

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

          const img = new Image();
          img.onload = (event) => {
            width = img.width;
            height = img.height;

          }
          img.src = URL.createObjectURL(thumbnail);
        }

        reader.readAsDataURL(chunk);
        reader.onload = async () => {
          const base64Chunk = reader.result?.toString().split(',')[1];

          const payload = {
            GUIDObjSender: UUIDApiCall,
            MediaData: base64Chunk,
            Thumbnail: base64Thumbnail,
            size: {
              Width: width,
              Height: height
            },
            FileName: video.name,
            ChunkNumber: chunkNumber,
            TotalChunks: totalChunks,
            Title: title,
            Description: description,
          };

          console.log(payload)
          console.log("payload", payload.GUIDObjSender)

          try {
            await Api.SendApiRequestPostAsync(`${this.ApiUrl}/Videos/UploadVideo`, payload,
              httpHeaders.httpHeaderJsonWithToken(this.Token)
            ).then(async response => {
              if (await response.text() === "Saved the new Post" && response.ok) {
                resolve(true);
              }
            });
            } catch (error) {
              console.error(`Error uploading chunk ${chunkNumber}:`, error);
              reject(false);
            }
          };
        }
      });
  }

  public static DeleteUser(DeletedName: string) {
    if (DeletedName !== this.User.username) {
      return;
    }

    const HttpHeaderDelete = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain'
    };

    Api.SendApiRequestWithHeaderDeleteAsync(`${this.ApiUrl}/users/DeleteUser`, HttpHeaderDelete).catch(ErrorHandler);
  }


  public static DeleteVideo(VideoId: number) {
    const HttpHeaderDelete = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain'
    };

    Api.SendApiRequestWithHeaderDeleteAsync(`${this.ApiUrl}/Video/DeleteVideo?videoId=${VideoId}`, HttpHeaderDelete).catch(ErrorHandler);
  }

  public static DeleteImage(imageId: number) {
    const HttpHeaderDelete = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain'
    };

    Api.SendApiRequestWithHeaderDeleteAsync(`${this.ApiUrl}/ImagePosts/DeleteImage?imageId=${imageId}`, HttpHeaderDelete).catch(ErrorHandler);
  }

  public static async likeContent(likeVideo: number, Type: string): Promise<string> {

    let returnValue: string = "";
    await Api.SendApiRequestPostAsync(`${this.ApiUrl}/Reactions/Like?contentId=${likeVideo}&ContentType=${Type}`, null,
      httpHeaders.httpHeaderJsonWithToken(this.Token)
    ).then(async response => {
      if (response.ok) {
        returnValue = await response.text()
      }
    });

    return returnValue;
  }


  public static ChangeUserData(data: String | File, TypeOfChange: EeditUserType): boolean {
    const HttpHeaderPut = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain'
    };

    const HttpHeaderPutBody = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    };

    switch (TypeOfChange) {
      case EeditUserType.Email:
        if (typeof data === "string") {
          Api.SendApiRequestPutAsync(`${this.ApiUrl}/users/ChangeEmail?newEmail=${data}`, HttpHeaderPut).then(async (response) => {
            const text = await response.text();
            if (text && text === "Email Updated") {
              return true;
            }
            return false;
          }).catch(ErrorHandler);
        }
        break;

      case EeditUserType.password:
        if (typeof data === "string") {
          Api.SendApiRequestPutWithBodyAsync(`${this.ApiUrl}/users/ChangePassword`, { "newPassword": data }, HttpHeaderPutBody).then(async (response) => {
            const text = await response.text();
            if (text && text === "Password Changed") {
              return true;
            }
            return false;
          }).catch(ErrorHandler);
        }
        break;

      case EeditUserType.UserName:
        if (typeof data === "string") {
          Api.SendApiRequestPutAsync(`${this.ApiUrl}/users/ChangeUsername?newUsername=${data}`, HttpHeaderPut).then(async (response) => {
            const text = await response.text();
            if (text && text === "Username Update") {
              return true;
            }
            return false;
          }).catch(ErrorHandler);
        }
        break;

      case EeditUserType.ProfilePicture:
        const reader = new FileReader()

        if (typeof data === "string") {
          return false;
        }

        reader.onload = async (event) => {
          if (event.target?.result) {
            const base64Chunk = event.target.result?.toString().split(',')[1];

            Api.SendApiRequestPutAsync(`${this.ApiUrl}/users/ChangeProfilePicture?newProfilePicture=${base64Chunk}`, HttpHeaderPut).then(async (response) => {
              const text = await response.text();
              if (text && text === "Profile_Picture Updated") {
                return true;
              }
              return false;
            }).catch(ErrorHandler);
          }
        }

        reader.readAsDataURL(data as File);
        break;

      default:
        console.error("ERROR: Edit User data type doesnt exist");
        break;
    }
    return false;
  }
}