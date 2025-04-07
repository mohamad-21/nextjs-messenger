export interface IChatListItem {
  id: number;
  name: string;
  profile_photo: string | null;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageProps {
  from: number;
  to: number;
  message: string | null;
  imageUrl: string | null
}

export interface ChatListType {
  id: number;
  name: string;
  profile_photo: string | null;
  link: string;
  last_message: string | null;
  last_message_date: Date | null;
  last_message_image: string | null;
  createdAt: Date;
  updatedAt: Date;
}