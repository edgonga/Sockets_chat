import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/userController';
import { Server } from 'socket.io'

export const userRouters = (fastify: FastifyInstance, io: Server): void => {
    userController.setIO(io)

    fastify.post('/login', userController.createUserHandler)
}