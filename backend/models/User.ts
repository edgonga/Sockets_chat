import { Room } from "./Room"

export class User {
    name: string | string[] 
    password: string
    id: string
    room: Room | undefined

    constructor(name: string, password: string, id: string) {
        this.name = name
        this.password = password
        this.id = id
    }
}