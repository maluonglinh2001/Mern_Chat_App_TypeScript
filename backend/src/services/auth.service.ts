import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUser, IUserDocument } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';

const createToken = (user: IUserDocument): TokenData => {
  const dataStoredInToken: DataStoredInToken = { _id: user._id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: IUser): Promise<{ cookie: string; newUser: IUser; tokenData: TokenData }> {
    const existingUser: IUser = await UserModel.findOne({ email: userData.email }).exec();
    if (existingUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUser = { ...userData, password: hashedPassword };
    const newUser: IUserDocument = await UserModel.create(createUserData);
    const tokenData = createToken(newUser);
    const cookie = createCookie(tokenData);
    return { cookie, newUser, tokenData };
  }

  public async login(userData: IUser): Promise<{ cookie: string; findUser: any; tokenData: TokenData }> {
    const findUser: IUserDocument = await UserModel.findOne({ email: userData.email }).exec();
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);
    return { cookie, findUser, tokenData };
  }

  public async logout(userData: IUser): Promise<IUser> {
    const findUser: IUser = await UserModel.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
