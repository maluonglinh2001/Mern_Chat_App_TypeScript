import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { ChatModel } from '@/models/chats.model';
import { UserModel } from '@/models/users.model';
import { IMessage } from '@/interfaces/messages.interface';
import { MessageModel } from '@/models/messages.model';

@Service()
export class MessageService {
  public async allMessage(chatId: string): Promise<IMessage[]> {
    const messages = await MessageModel.find({ chat: chatId }).populate('sender', 'name pic email').populate('chat');
    return messages;
  }

  public async sendMessage(userReq: string, content: string, chatId: string): Promise<IMessage> {
    if (!content || !chatId) {
      throw new HttpException(400, 'Invalid data passed into request');
    }

    const newMessage = {
      sender: userReq,
      content: content,
      chat: chatId,
    };

    const message: any = await MessageModel.create(newMessage);
    const message1: any = await message.populate('sender', 'name pic email');
    const message2: any = await message1.populate({ path: 'chat', populate: [{ path: 'users' }, { path: 'groupAdmin' }] });
    await ChatModel.findByIdAndUpdate(userReq, { latestMessage: message2 });
    return message2;
  }
}
