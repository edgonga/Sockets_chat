import { Socket } from 'socket.io';
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User';
import { IDGenerator } from '../dependencies/IDGenerator';
import app from '../server/app';

const users: Map<string, User> = new Map()
const idGenerator = new IDGenerator()
let io

export const userController = {
    setIO: (socketIO) => {
        io = socketIO
    },

    createUser: (username: string, password: string, socket: Socket) => {

        const existingUser = Array.from(users.values()).find((user) => user.name === username && user.password === password)
        if (existingUser) {
            existingUser.id = idGenerator.generate()
            console.log("Existing User connected");
            
        } else if (username && password) {
            const user = new User(username, password, idGenerator.generate())
            users.set(socket.id, user)
            console.log('New User added', socket.id);
            
        } else {
            console.log(`Invalid user data for socket`, );
            socket.disconnect();
            return;
        }
    },
    createUserHandler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        
        app.ready().then(() => {
            io.on("connection", (socket: Socket) => {
            console.log("--> New socket connected ", socket.id);
            })
        })
        

        const { username, password } = request.body as any
        try {
            const newUser = userController.createUser(username, password, io);
            reply.send(newUser);
        } catch (error) {
            reply.status(500).send({ error: 'Error creating user' });
        }
    }
}