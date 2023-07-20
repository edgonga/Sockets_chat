import { Socket } from 'socket.io';
import { Message } from '../models/Message'
import { User } from '../models/User'
import { IDGenerator } from '../dependencies/IDGenerator';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Room } from '../models/Room';

const messages: Message[] = []
const users: Map<string, User> = new Map()
const rooms: Room[] = []
const idGenerator = new IDGenerator()
let io

export const chatController = {
    setIO: (socketIO) => {
        io = socketIO
    },
    
    getAllMessages: (): Message[] => {
        return messages
    },

    createMessage: (content: string, sender: string): Message => {
        const id = idGenerator.generate()
        const timestamp = new Date().toISOString()
        const newMessage: Message = new Message(id, content, sender, timestamp)
        
        messages.push(newMessage);
        return newMessage
    },

    handleSocketConnection: (socket: Socket): void => {
        
        const id = typeof socket.handshake.query.id === 'string' ? socket.handshake.query.id : socket.handshake.query.id?.toString();
        const username = typeof socket.handshake.query.username === 'string' ? socket.handshake.query.username : socket.handshake.query.username?.toString();
        const password = typeof socket.handshake.query.password === 'string' ? socket.handshake.query.password : socket.handshake.query.password?.toString();

        console.log(`User ${username} connected, with session: ${socket.id}`);

        const existingUser = Array.from(users.values()).find((user) => user.name === username && user.password === password)
        if (existingUser) {
            existingUser.id = socket.id
        } else if (id && username && password) {
            const user = new User(username, password, socket.id)
            users.set(socket.id, user)
        } else {
            console.log(`Invalid user data for socket ${socket.id}`);
            socket.disconnect();
            return;
        }

        emitRoomsToClient(socket)

        socket.on("joinRoom", (roomId) => {
            const user = getUserBySocketId(socket.id)

            if (user) {
                const selectedRoom = findRoomById(roomId)
                if (selectedRoom) {
                    users.set(user.id, {...user, roomId: selectedRoom.id})
                    selectedRoom.users.push(user)
                    console.log(`User ${user.name} joined room ${selectedRoom.topic}`);
                } else {
                    console.log(`Room not found with id ${selectedRoom}`);
                    socket.disconnect()
                    return
                }
            }
        })

        socket.on(`disconnect`, () => {
            console.log(`User disconnected: ${socket.id}`);
            users.delete(socket.id)
            
        })

        socket.on('newMessage', (data, roomId) => {
            const sender = getUserBySocketId(socket.id)
            
            
            if (sender && sender.room) {
                const { content } = data
                const newMessage = chatController.createMessage(content, sender)
                io.to(user).emit("message", newMessage)
            }
            
            // De momento he añadido una propiedad a User que sea room, aunque no sé si debe ser el ID o el topic (quizás el id)
            // se ha de revisar si en algún momento a esta propiedad se le añade la room a la que el User se ha unido
            // además, también deberíamos crear dentro de const chatController pero fuera de handleSocketConnection, una función que sea createRoom.
            // por último, deberíamos acabar de hacer el evento "newMessage" mirar chat GPT
            
        })
    },

    getAllMessagesHandler: async(request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const messages = chatController.getAllMessages();
            reply.send(messages);
        } catch (error) {
            reply.status(500).send({ error: 'Error retrieving messages' });
        }
    },

    createMessageHandler: async (request, reply): Promise<void> => {
        const { content, sender } = request.body;
        try {
            const newMessage = chatController.createMessage(content, sender);
            reply.send(newMessage);
        } catch (error) {
            reply.status(500).send({ error: 'Error creating message' });
        }
    }    
}

function emitRoomsToClient(socket: Socket) {
    const roomData = rooms.map((room) => ({ id: room.id, name: room.topic }));
    socket.emit('rooms', roomData);
}
  
  function getUserBySocketId(socketId: string): User | undefined {
    return users.get(socketId);
}
  
  function findRoomById(roomId: string): Room | undefined {
    return rooms.find((room) => room.id === roomId);
}