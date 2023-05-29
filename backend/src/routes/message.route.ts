import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { MessageController } from '@/controllers/message.controller';
export class MessageRoute implements Routes {
  public path = '/message';
  public router = Router();
  public message = new MessageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:chatId`, AuthMiddleware, this.message.allMessage);
    this.router.post(`${this.path}`, AuthMiddleware, this.message.sendMessage);
  }
}
