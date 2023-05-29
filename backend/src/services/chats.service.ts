import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { IChat, IChatDocument, IChatModel } from '@/interfaces/chat.interface';
import { IUser, IUserModel, IUserDocument } from '@/interfaces/users.interface';
import { ChatModel } from '@/models/chats.model';
import { UserModel } from '@/models/users.model';
import { Request } from 'express';
import { DataStoredInToken, RequestWithUser } from '@/interfaces/auth.interface';
@Service()
export class ChatService {
  public async accessChat(userReq: string, userId: string): Promise<IChat> {
    if (!userId) throw new HttpException(400, 'UserId param not sent with reques');

    let isChat: any[] = await ChatModel.find({
      isGroupChat: false,
      $and: [{ users: { $elemMatch: { $eq: userReq } } }, { users: { $elemMatch: { $eq: userId } } }],
    })
      .populate('users', '-password')
      .populate('latestMessage')
      .exec();
    isChat = await UserModel.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });
    if (isChat.length > 0) {
      return isChat[0];
    } else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [userReq, userId],
      };
      const createdChat = await ChatModel.create(chatData);

      const FullChat = (await ChatModel.findOne({ _id: createdChat._id })).populate('users', '-password');
      return FullChat;
    }
  }

  public async fetchChats(userReq: string): Promise<IChat[]> {
    const results = await ChatModel.find({ users: { $elemMatch: { $eq: userReq } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updateAt: -1 });
    const populatedResults: any[] = await UserModel.populate(results, {
      path: 'latestMessage.sender',
      select: 'name pick email',
    });
    return populatedResults;
  }

  public async createGroupChat(userReq: string, users: string, name: string): Promise<IChat[]> {
    if (!users || !name) throw new HttpException(400, 'Please fill all the fields');

    const user: string[] = JSON.parse(users);
    if (user.length < 2) throw new HttpException(400, 'More than 2 users are required to from a group chat');

    user.push(userReq);

    const groupChat = await ChatModel.create({
      chatName: name,
      users: user,
      isGroupChat: true,
      groupAdmin: userReq,
    });
    const fullGroupChat: any[] = await ChatModel.findOne({ _id: groupChat._id }).populate('users', '-password').populate('groupAdmin', '-password');

    return fullGroupChat;
  }

  public async renameGroup(chatId: string, chatName: string): Promise<IChat> {
    const updateChat = await ChatModel.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updateChat) {
      throw new HttpException(404, 'Chat Not Found');
    } else return updateChat;
  }

  public async removeFromGroup(chatId: string, userId: string): Promise<IChat> {
    const remove: IChat = await ChatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .exec();
    if (!remove) {
      throw new HttpException(404, 'Chat Not Found!');
    } else return remove;
  }

  public async addToGroup(chatId: string, userId: string): Promise<IChat> {
    const add = await ChatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    if (!add) {
      throw new HttpException(404, 'Chat Not Found');
    } else return add;
  }
}
