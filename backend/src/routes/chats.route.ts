import { Router } from 'express';
import { ChatController } from '@/controllers/chats.controller';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class ChatRoute implements Routes {
  public path = '/chat';
  public router = Router();
  public chat = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, AuthMiddleware, this.chat.accessChat);
    this.router.get(`${this.path}`, AuthMiddleware, this.chat.fetchChats);
    this.router.post(`${this.path}/group`, AuthMiddleware, this.chat.createGroupChat);
    this.router.put(`${this.path}/rename`, AuthMiddleware, this.chat.renameGroup);
    this.router.put(`${this.path}/removeUser`, AuthMiddleware, this.chat.removeFromGroup);
    this.router.put(`${this.path}/groupAdd`, AuthMiddleware, this.chat.addToGroup);
  }
}
