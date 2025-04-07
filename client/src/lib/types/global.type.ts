export interface SocketMessageType {
  type: string;
}

export interface ChatMessageType extends SocketMessageType {
  from: number;
  to: number;
  message: string
}