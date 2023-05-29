import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { IUser } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class UserController {
  public user = Container.get(UserService);

  public allUsers = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const keyword = String(req.query.search);
      const allUser: IUser[] = await this.user.allUsers(req.UserID, keyword);
      res.status(200).json(allUser);
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: IUser[] = await this.user.findAllUser();

      res.status(200).json(findAllUsersData);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const findOneUserData: IUser = await this.user.findUserById(userId);

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const createUserData: IUser = await this.user.createUser(userData);

      res.status(201).json(createUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userData: IUser = req.body;
      const updateUserData: IUser[] = await this.user.updateUser(userId, userData);

      res.status(200).json(updateUserData);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const deleteUserData: IUser[] = await this.user.deleteUser(userId);

      res.status(200).json(deleteUserData);
    } catch (error) {
      next(error);
    }
  };
}
