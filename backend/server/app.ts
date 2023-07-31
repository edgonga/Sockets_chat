import Fastify, { FastifyInstance } from 'fastify';
import { chatRouters } from '../routers/chatRouters';
import { userRouters } from '../routers/userRouters';
import { Server, Socket } from 'socket.io';
import cors from '@fastify/cors'
import fastifyIO, { socketioServer } from 'fastify-socket.io'

const app = Fastify()
app.register(fastifyIO)

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin']
})

const io = new Server(app.server)

app.get("/", (request, reply) => {
  app.io.emit("Hello")
})

app.ready().then(() => {
  app.io.on("connection", (socket) => {
    console.log("Socket connected ", socket.id);
    
  })
})

// let io!: Server

// export function configureSocketIO(server: FastifyInstance) {
//   io = new Server(server.server)
//   io.on("connection", (socket: Socket) => {
//     socket.emit("New socket connected ", socket.id)
//     socket.on("New socket connected", (socket) => {
//       console.log(`New socket connected ${socket.id}`);
      
//     })
//   })
// }

// configureSocketIO(app)

userRouters(app, io)
chatRouters(app, io)

export default app;

// https://socket.io/docs/v4/server-initialization/
