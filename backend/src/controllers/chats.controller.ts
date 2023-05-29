import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser, DataStoredInToken } from '@/interfaces/auth.interface';
import { IUser } from '@/interfaces/users.interface';
import { ChatService } from '@/services/chats.service';
import { IChat } from '@/interfaces/chat.interface';

export class ChatController {
  public chat = Container.get(ChatService);

  public accessChat = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.body;

      const chat: IChat = await this.chat.accessChat(req.UserID, userId);
      res.status(201).json(chat);
    } catch (error) {
      next(error);
    }
  };

  public fetchChats = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fetchChat: IChat[] = await this.chat.fetchChats(req.UserID);
      res.status(200).json(fetchChat);
    } catch (error) {
      next(error);
    }
  };

  public createGroupChat = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { users, name } = req.body;
      const gpChat: IChat[] = await this.chat.createGroupChat(req.UserID, users, name);
      res.status(200).json(gpChat);
    } catch (error) {
      next(error);
    }
  };

  public renameGroup = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { chatId, chatName } = req.body;
      const rnamegpChat: IChat = await this.chat.renameGroup(chatId, chatName);
      res.status(200).json(rnamegpChat);
    } catch (error) {
      next(error);
    }
  };

  public removeFromGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { chatId, userId } = req.body;
      const rmFormGp: IChat = await this.chat.removeFromGroup(chatId, userId);
      res.status(200).json(rmFormGp);
    } catch (error) {
      next(error);
    }
  };

  public addToGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { chatId, userId } = req.body;
      const add = await this.chat.addToGroup(chatId, userId);
      res.status(200).json(add);
    } catch (error) {}
  };
}
