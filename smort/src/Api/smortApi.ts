import { Api } from "./Api";
import { ThumbnailObject } from "./ApiObjects/ThumbnailObjects";
import { IMyProfile } from "./ApiObjects/userObjects";
import Cookies from 'js-cookie';
import { EeditUserType } from "./enums/EditUserEnum";
import { ErrorHandler } from "./Logging";
import { httpHeaders } from "./httpHeaders"
import { ContentItem } from "./ApiObjects/ContentObject";
import { FollowingUser } from "./ApiObjects/FollowingObjects";
import * as signalR from '@microsoft/signalr';
import { jwtDecode } from "jwt-decode";
import { SmortTokenPayload } from "./enums/TokenPayload";
import { IUser } from "./ApiObjects/IUser";
import { Answer } from "./ApiObjects/Awnser";

export class smortApi {
  public static ApiUrl: string = "https://api.socials.devilskey.nl";

  protected static User: IMyProfile;
  public static Token: string | null = null;
  protected static LoggedIn: boolean = false;


  public static SetUpApiUrl() {
    if (window.location.hostname.includes("devilskey.nl") ||
      window.location.hostname.includes("smorthub.nl")) {
      this.ApiUrl = "https://api.socials.devilskey.nl";
      return;
    }
    else {
      this.ApiUrl = "https://localhost:7147";
      return;
    }
  }

  public static SetupNotifications() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.ApiUrl}/Notify`, {
        accessTokenFactory: () => { return `${this.Token}` },
        withCredentials: true,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();


    connection.start().then(() => console.log("Connected"))
      .catch(err => console.error("Error connecting:", err));

    connection.on("ReceiveNotificationVideo", (message) =>
      this.ManageNotificationsFromApi(message));

    connection.on("ReceiveNotificationFollow", (message) =>
      this.ManageNotificationsFromApi(message));

    connection.on("ReceiveNotificationFollowing", (message) =>
      this.ManageNotificationsFromApi(message));

    connection.on("ReceiveNotificationLike", (message) =>
      this.ManageNotificationsFromApi(message));
  }

  private static ManageNotificationsFromApi(message: string) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        message,
      });
    } else {
      alert(message)
    }
  }

  public static GetUserRole(): number {
    if (this.Token !== null) {
      let decoded = jwtDecode<SmortTokenPayload>(this.Token);
      return decoded.role
    }
    return -1;
  }

  public static getUser(): IMyProfile | undefined {
    if (this.User !== null) {
      return this.User;
    }
    return undefined;
  }

  public static async GetMyProfileAsync(): Promise<IMyProfile> {
    if (this.User !== undefined) {
      return this.User;
    }
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/users/GetMyProfile`,
      httpHeaders.httpHeaderJsonWithToken(this.Token))
      .then(async (response) => {
        const jsonData: IMyProfile = await response.json();
        this.User = jsonData;
      });
    return this.User;
  }

  public static async GetProfileAsync(id: number): Promise<IMyProfile> {

    let dataUser: IMyProfile = {
      id: null,
      username: "",
      profile_Picture: 0,
      Is_Account_Configured: false
    };

    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/users/GetUserDataProfile?id=${id}`)
      .then(async (response) => {
        const jsonData: any[] = await response.json();
        dataUser.username = jsonData[0].Username;
        dataUser.profile_Picture = jsonData[0].Profile_Picture;
      });

    return dataUser;
  }

  public static GetProfilePictureImageUrl(UserId: number) {
    return `${this.ApiUrl}/Images/GetUsersProfileImage?UserId=${UserId}`
  }

  public static GetImageUrl(id?: number, content: boolean = true) {
    if (id) {
      return `${this.ApiUrl}/Images/GetImage?ImageId=${id}&IsContent=${content}`
    }
    return `${this.ApiUrl}/Images/GetImage?ImageId=${this.User?.profile_Picture}&IsContent=${content}`
  }

  public static async GetContentItemAsync(cotentId: string): Promise<ContentItem[]> {
    let images: ContentItem[] = [];
    if (this.Token !== null) {

      await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Posts/GetContentFromId?id=${cotentId}`,
        httpHeaders.httpHeaderJsonWithToken(this.Token))
        .then(async (response) => {
          const jsonData: ContentItem[] = await response.json();
          images = jsonData;
        });
      return images;

    }
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Posts/GetContentFromId?id=${cotentId}`)
      .then(async (response) => {
        const jsonData: ContentItem[] = await response.json();
        images = jsonData;
      });
    return images;
  }

  public static async GetContentList(search: string) {
    let postImages: ContentItem[] = [];
    if (this.Token !== null) {
      await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Posts/GetContentList?search=${search}`,
        httpHeaders.httpHeaderJsonWithToken(this.Token))
        .then(async (response) => {
          
          const jsonData: ContentItem[] = await response.json();
          postImages = jsonData;
        });
      return postImages;
    }

    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Posts/GetContentList?search=${search}`)
      .then(async (response) => {
        const jsonData: ContentItem[] = await response.json();
        postImages = jsonData;
      });
    return postImages;
  }

  public static async GetUsersContent(userId: number): Promise<ThumbnailObject[]> {
    let thumbnailData: ThumbnailObject[] = []
    await Api.SendApiRequestGetAsync(`${this.ApiUrl}/Posts/GetAccountContentList?idUser=${userId}`).then(async (response) => {
      const jsonData: ThumbnailObject[] = await response.json();
      thumbnailData = jsonData;
    }).catch((error) => console.error(error))
    return thumbnailData;
  }

  public static async GetMyContent(): Promise<ThumbnailObject[]> {
    let thumbnailData: ThumbnailObject[] = []
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Posts/GetAccountContentList`,
      httpHeaders.httpHeaderJsonWithToken(this.Token)).then(async (response) => {

        const jsonData: ThumbnailObject[] = await response.json();
        thumbnailData = jsonData;
      }).catch((error) => console.error(error))

    return thumbnailData;
  }

  public static async GetFollowingAccounts(): Promise<FollowingUser[]> {
    let FollowingData: FollowingUser[] = []
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Following/Following`,
      httpHeaders.httpHeaderJsonWithToken(this.Token)).then(async (response) => {

        const jsonData: FollowingUser[] = await response.json();
        FollowingData = jsonData;
      }).catch((error) => console.error(error))

    return FollowingData;
  }

  public static async GetMostFollowed(): Promise<FollowingUser[]> {
    let FollowingData: FollowingUser[] = []
    await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Following/MostFolowers`,
      httpHeaders.httpHeaderJsonWithToken(this.Token)).then(async (response) => {

        const jsonData: FollowingUser[] = await response.json();
        FollowingData = jsonData;
      }).catch((error) => console.error(error))

    return FollowingData;
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
    if (!description || !image) {
      return false;
    }
    return new Promise((resolve, reject) => {
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



  public static async UploadVideo(video: File | null, title: string, description: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

      if (!description || !video) {
        return;
      }

      var UUIDApiCall = crypto.randomUUID();
      const chunkSize = (1024 * 1024) * 20;
      const totalChunks = Math.ceil(video.size / chunkSize);

      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        let start = chunkNumber * chunkSize;
        let end = Math.min(start + chunkSize, video.size);
        let chunk = video.slice(start, end);

        const reader = new FileReader();

        let width = 0;
        let height = 0;

        reader.readAsDataURL(chunk);
        reader.onload = async () => {
          const base64Chunk = reader.result?.toString().split(',')[1];

          const payload = {
            GUIDObjSender: UUIDApiCall,
            MediaData: base64Chunk,
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

  public static async GetAllUsers(): Promise<IUser[]> {
    const HttpHeaderGet = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain',
    };

    try {
      const response = await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/Admin/users/All`, HttpHeaderGet);
      const data: IUser[] = await response.json();


      if (Array.isArray(data)) {
        return data as IUser[];
      } else {
        console.error("GetAllUsers: Response is not an array", data);
        return [];
      }
    } catch (error) {
      ErrorHandler(error);
      return [];
    }
  }

  public static async SetUserAlow(UserId: number, Allow: boolean): Promise<boolean> {

    const HttpHeaderGet = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    };
    const response = await Api.SendApiRequestPostWithBodyAsync(`${this.ApiUrl}/Admin/users/PlatformAccess`, { Id: UserId, Allow: Allow }, HttpHeaderGet);
    if (response.ok) {
      return true
    }
    return false
  }

  public static async CreateQuestion(Content: string): Promise<boolean> {

    const HttpHeaderGet = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    };
    const response = await Api.SendApiRequestPostWithBodyAsync(`${this.ApiUrl}/AskMe/CreateQuestion`, { content: Content }, HttpHeaderGet);
    if (response.ok) {
      return true
    }
    return false
  }

  public static async CreateAnswer(Content: string, questionId: number): Promise<boolean> {

    const HttpHeaderGet = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    };
    const response = await Api.SendApiRequestPostWithBodyAsync(`${this.ApiUrl}/AskMe/CreateAnswer/${questionId}`, { content: Content }, HttpHeaderGet);
    if (response.ok) {
      return true
    }
    return false
  }


  public static async GetAwnser(questionId: number): Promise<Answer[] | undefined> {
    const HttpHeaderGet = {
      "Authorization": `Bearer ${this.Token}`,
      'Accept': 'text/plain',
      'Content-Type': 'application/json'
    };

    const response = await Api.SendApiRequestWithHeaderGetAsync(`${this.ApiUrl}/AskMe/Answer/${questionId}`, HttpHeaderGet);

    const jsonData: Answer[] = await response.json();
    if (response.ok) {
      return jsonData
    }
    return undefined;
  }

  public static async ConfigureAccountAsync(email: string, Profile_Picture: File, Username: string) {
    const httpHeader = {
      "Content-Type": "application/json",
      'Accept': 'text/plain',
      "Authorization": `Bearer ${this.Token}`,
    };

    if (!email || !Username || !Profile_Picture) {
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
            await Api.SendApiRequestPostAsync(`${this.ApiUrl}/users/ConfigureUserData`, {
              email: email,
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
}
