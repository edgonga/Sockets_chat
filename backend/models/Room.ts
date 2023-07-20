import { User } from "./User"

export class Room {
    topic: string
    id: string
    users: User[]

    constructor(id: string, topic: string) {
        this.id = id
        this.topic = topic
        this.users = []
    }
}