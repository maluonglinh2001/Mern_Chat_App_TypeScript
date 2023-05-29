import { IMessageModel, IMessageDocument, IMessage } from '@/interfaces/messages.interface';
import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema<IMessageDocument, IMessageModel>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const MessageModel: IMessageModel = mongoose.model<IMessageDocument, IMessageModel>('Message', messageSchema);

export { IMessageModel, IMessageDocument, IMessage, MessageModel };
