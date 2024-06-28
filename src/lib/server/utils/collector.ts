/**
 * The type of the message send
 */
export enum MessageType {
  Response = 'response',
  Message = 'message',
}

/**
 * The category of the message
 */
export enum MessageCategory {
  Inappropriate = 'inappropriate',
  Normal = 'normal',
  Important = 'important',
}
