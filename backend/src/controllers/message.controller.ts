import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser, DataStoredInToken } from '@/interfaces/auth.interface';
import { IUser } from '@/interfaces/users.interface';
import { IChat } from '@/interfaces/chat.interface';
import { IMessage } from '@/interfaces/messages.interface';
import { MessageService } from '@/services/message.service';
export class MessageController {
  public message = Container.get(MessageService);
  public allMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chatId = String(req.params.chatId);
      const allMess = await this.message.allMessage(chatId);
      res.status(200).json(allMess);
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { content, chatId } = req.body;
      const sendMess = await this.message.sendMessage(req.UserID, content, chatId);
      res.status(200).json(sendMess);
    } catch (error) {
      next(error);
    }
  };
}
