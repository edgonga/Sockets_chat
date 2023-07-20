import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { chatRouters } from '../routers/chatRouters';
import { Server } from 'socket.io';

const app = Fastify();

const io = new Server(app.server, {
  cors: {
    origin: '*',
  },
});

chatRouters(app, io)

export default app;
