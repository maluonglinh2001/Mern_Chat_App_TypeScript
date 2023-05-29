import { Document, Model, Types } from 'mongoose';
interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage: Types.ObjectId | null;
  groupAdmin: Types.ObjectId | null;
  createAt: Date;
  updateAt: Date;
}

interface IChatDocument extends IChat, Document {}
type IChatModel = Model<IChatDocument>;

export { IChat, IChatDocument, IChatModel };
