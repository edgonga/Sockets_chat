import { Socket } from 'socket.io';
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User';

const users: Map<string, User> = new Map()
let io

export const userController = {
    setIO: (socketIO) => {
        io = socketIO
    },

    createUser: (username: string, password: string, socket: Socket) => {
        const existingUser = Array.from(users.values()).find((user) => user.name === username && user.password === password)
        if (existingUser) {
            existingUser.id = socket.id
        } else if (socket.id && username && password) {
            const user = new User(username, password, socket.id)
            users.set(socket.id, user)
        } else {
            console.log(`Invalid user data for socket ${socket.id}`);
            socket.disconnect();
            return;
        }
    },
    createUserHandler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const { username, password } = request.body as any
        try {
            const newUser = userController.createUser(username, password, io);
            reply.send(newUser);
        } catch (error) {
            reply.status(500).send({ error: 'Error creating user' });
        }
    }
}