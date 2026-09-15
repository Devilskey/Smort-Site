export interface ContentItem {
    id: number;
    title: string;
    description: string;
    userId: number;
    fileId: number;
    createdAt: string;
    username: string;
    likes: number;
    alreadyLiked: number;
    type:string;
  }