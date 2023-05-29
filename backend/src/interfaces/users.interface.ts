import { Document, Model } from 'mongoose';
interface IUser {
  name: string;
  email: string;
  password: string;
  pic: string;
  isAdmin: boolean;
  createAt: Date;
  updateAt: Date;
}

interface IUserDocument extends IUser, Document {}

type IUserModel = Model<IUserDocument>;

export { IUserDocument, IUserModel, IUser };
