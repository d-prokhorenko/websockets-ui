import { MessageType } from '../types/message-type.type.js';

export function handleWSRequest(request: MessageType): void {
  console.log(request);
}
