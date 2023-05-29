import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ChatRoute } from './routes/chats.route';
import { MessageRoute } from './routes/message.route';
import { ValidateEnv } from '@utils/validateEnv';
import { connectToDatabase } from './config/index';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new ChatRoute(), new MessageRoute()]);

app.listen();
connectToDatabase();
