import { IChatDocument, IChat, IChatModel } from '@/interfaces/chat.interface';
import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema<IChatDocument, IChatModel>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);
const ChatModel = mongoose.model<IChatDocument, IChatModel>('Chat', ChatSchema);
export { IChat, IChatModel, IChatDocument, ChatModel };
