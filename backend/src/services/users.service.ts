import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { IUser, IUserModel, IUserDocument } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';

@Service()
export class UserService {
  public async findAllUser(): Promise<IUser[]> {
    const users: IUser[] = await UserModel.find().exec();
    return users;
  }
  public async allUsers(userReq: string, keyword: string): Promise<IUser[]> {
    const userSearch: IUser[] = await UserModel.find({
      $or: [{ name: { $regex: keyword, $options: 'i' } }, { email: { $regex: keyword, $options: 'i' } }],
      _id: { $ne: userReq },
    });
    return userSearch;
  }

  public async findUserById(userId: string): Promise<IUser> {
    const findUser: IUserDocument = await UserModel.findOne({ _id: userId }).exec();
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: IUser): Promise<IUser> {
    const existingUser: IUser = await UserModel.findOne({ email: userData.email }).exec();
    if (existingUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createIUserData: IUser = { ...userData, password: hashedPassword };
    const newUser: IUserDocument = await UserModel.create(createIUserData);
    return newUser;
  }

  public async updateUser(userId: string, userData: IUser): Promise<IUser[]> {
    const findUser: IUserDocument = await UserModel.findOne({ _id: userId }).exec();
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const hashedPassword = await hash(userData.password, 10);
    findUser.password = hashedPassword;
    findUser.name = userData.name;
    await findUser.save(); // Lưu các thay đổi vào cơ sở dữ liệu
    const updateUserData: IUser[] = await UserModel.find();
    return updateUserData;
  }

  public async deleteUser(UserId: string): Promise<IUser[]> {
    const findUser: IUser = await UserModel.findOne({ _id: UserId }).exec();
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserModel.deleteOne({ _id: UserId });
    const updatedUserData: IUser[] = await UserModel.find();
    return updatedUserData;
  }
}
