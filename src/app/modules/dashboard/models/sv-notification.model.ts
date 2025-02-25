export interface SVNotification {
  id: string;
  dateCreated: Date;
  title: string;
  isRead: boolean;
  message?: string;
  userId?: string;
  isFormatted?: boolean;
  createdBy?: string;
}
