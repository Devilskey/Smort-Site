export interface SearchPost {
    id: number;
    fileId: number;

    description: string;
    type:string;
    createdAt: string;

    userId: number;
    username: string;

    likes: number;
    alreadyLiked: boolean;
  }