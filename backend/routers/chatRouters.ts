import { FastifyInstance } from 'fastify';
import { chatController } from '../controllers/chatController';
import { Server } from 'socket.io'

export const chatRouters = (fastify: FastifyInstance, io: Server): void => {
    chatController.setIO(io)
    
    fastify.get('/api/messages', chatController.createMessageHandler);
    fastify.post('/api/messages', chatController.createMessageHandler);

    //fastify.get("/api/messages", chatController.getAllMessages)
    //fastify.post("/api/messages", chatController.createMessage)
  
    io.on('connection', chatController.handleSocketConnection);
}