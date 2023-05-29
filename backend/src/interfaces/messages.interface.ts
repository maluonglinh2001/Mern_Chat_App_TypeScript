import { Document, Model, Types } from 'mongoose';

interface IMessage {
  sender: Types.ObjectId;
  content: string;
  chat: Types.ObjectId;
  readBy: Types.ObjectId;
  createAt: Date;
  updateAt: Date;
}

interface IMessageDocument extends IMessage, Document {}

type IMessageModel = Model<IMessageDocument>;

export { IMessage, IMessageDocument, IMessageModel };
