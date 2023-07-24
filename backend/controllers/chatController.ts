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

    createRoom: (topic: string): Room => {
        const id = idGenerator.generate()
        const newRoom: Room = new Room(id, topic)

        rooms.push(newRoom)
        return newRoom
    },

    handleSocketConnection: (socket: Socket): void => {
        console.log(`User connected with session: ${socket.id}`);

        emitRoomsToClient(socket)  // Ponerlo más abajo, ya que de momento no hay rooms definidas

        socket.on("newRoom", (roomTopic) => {
            const existingRoom = rooms.find((room) => room.topic === roomTopic)

            if (!existingRoom) {
                const newRoom = chatController.createRoom(roomTopic)
                console.log(`New room created: ${newRoom.topic}`);
                io.emit("roomCreated", { roomId: newRoom.id, topic: newRoom.topic })
            } else {
                console.log(`The room with topic ${existingRoom.topic} already exists, find another topic`);

            }

        })

        socket.on("joinRoom", (roomId) => {
            const user = getUserBySocketId(socket.id)
            const selectedRoom = findRoomById(roomId)

            if (user && selectedRoom) {

                if (!user.rooms?.includes(selectedRoom)) {
                    users.set(user.id, user)
                    selectedRoom.users.push(user)
                    user.rooms?.push(selectedRoom);
                    console.log(`User ${user.name} joined room ${selectedRoom.topic}`);
                } else {
                    console.log(`The user ${user.name} is already in room ${selectedRoom.topic}`);

                }

            } else {
                console.log(`Room not found with id ${selectedRoom}`);
                socket.disconnect()
                return
            }
        })

        socket.on(`disconnect`, () => {
            console.log(`User disconnected: ${socket.id}`);
            users.delete(socket.id)

        })

        socket.on('newMessage', (data, roomId) => {
            const sender = getUserBySocketId(socket.id)
            const selectedRoom = findRoomById(roomId)


            if (sender && sender.rooms) {
                const { content } = data
                const newMessage = chatController.createMessage(content, sender.name)
                io.to(selectedRoom?.id).emit("message", newMessage)
            } else {
                console.log(`User ${sender?.name} can't send a message without joining a room`);
                return
            }
        })
    },

    getAllMessagesHandler: async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const messages = chatController.getAllMessages();
            reply.send(messages);
        } catch (error) {
            reply.status(500).send({ error: 'Error retrieving messages' });
        }
    },

    createMessageHandler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const { content, sender } = request.body as any;
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