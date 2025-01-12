import { PostImage } from "./PostImageObjects";
import { Video } from "./VideoObject";

export class Post {
    public Type: string = "";
    public Id: number = 0;
    public Likes: number = 0;
    public AlreadyLiked: number = 0;
    public Title: string = "";
    public Description: string = "";
    public User_Id: number = 0;
    public File_Id: number = 0;
    public Username: string = "";
    public Created_At: string = "";
}

export class PostTranslate {
    
    public static isPostImage(item: PostImage | Video): item is PostImage {
        return (item as PostImage).File_Id !== undefined; // Replace with a property unique to PostImage
    }

    public static ToPost(item: PostImage | Video): Post {
        const newPost: Post = {
            Type: this.isPostImage(item) ? "img" : "vid",
            Id: item.Id,
            Likes: item.Likes,
            AlreadyLiked: item.AlreadyLiked,
            Title: item.Title,
            Description: item.Description,
            User_Id: item.User_Id,
            File_Id: this.isPostImage(item) ? item.File_Id : 0,
            Username: item.Username,
            Created_At: item.Created_At,
        };
        return newPost;
    }
}