export interface InboxFeed {
  id: number;
  notificationFromUser: number;
  text: string;
  hasSeen: boolean;
  createdAt: Date;
}