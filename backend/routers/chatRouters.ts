import { FastifyInstance } from 'fastify';
import { chatController } from '../controllers/chatController';
import { Server } from 'socket.io'

export const chatRouters = (fastify: FastifyInstance, io: Server): void => {
    chatController.setIO(io)
    
    fastify.get('/conversation', chatController.getAllMessagesHandler);
    fastify.post('/newMessage', chatController.createMessageHandler);
  
    //io.on('connection', chatController.handleSocketConnection);
}