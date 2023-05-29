import { IUserDocument, IUserModel, IUser } from '@interfaces/users.interface';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const UserModel: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export { IUser, IUserDocument, IUserModel, UserModel };
