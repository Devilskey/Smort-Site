export interface ContentItem {
    id: number;
    title: string;
    description: string;
    userId: number;
    fileId: number;
    created_at: string;
    username: string;
    likes: number;
    alreadyLiked: number;
    type:string;
  }