import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';
import http from 'http';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import color from 'colors';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public server: http.Server;
  public io: Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      pingTimeout: 60000,
      cors: {
        origin: 'http://localhost:3000',
        // credentials: true,
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(color.red(`=================================`));
      logger.info(color.red(`======= ENV: ${this.env} =======`));
      logger.info(color.red(`🚀 App listening on the port ${this.port}`));
      logger.info(color.red(`=================================`));
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private initializeSocketIO() {
    this.io.on('connection', socket => {
      console.log('Connected to socket.io');
      socket.on('setup', userData => {
        socket.join(userData._id);
        socket.emit('connected');
      });

      socket.on('join chat', room => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
      });
      socket.on('typing', room => socket.in(room).emit('typing'));
      socket.on('stop typing', room => socket.in(room).emit('stop typing'));

      socket.on('new message', newMessageRecieved => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
          if (user._id == newMessageRecieved.sender._id) return;

          socket.in(user._id).emit('message recieved', newMessageRecieved);
        });
      });

      socket.off('setup', userData => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
      });
    });
  }
}
