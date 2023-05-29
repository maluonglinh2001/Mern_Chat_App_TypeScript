import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { IUser } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { token } from 'morgan';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const signUpUserData: any = await this.auth.signup(userData);

      res.status(201).json({
        _id: signUpUserData.newUser._id,
        name: signUpUserData.newUser.name,
        email: signUpUserData.newUser.email,
        isAdmin: signUpUserData.newUser.isAdmin,
        pic: signUpUserData.newUser.pic,
        token: signUpUserData.tokenData.token,
      });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const { cookie, findUser, tokenData } = await this.auth.login(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        isAdmin: findUser.isAdmin,
        pic: findUser.pic,
        token: tokenData.token,
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUser = req.userData;
      const logOutUserData: IUser = await this.auth.logout(userData);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
