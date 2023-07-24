import { Room } from "./Room"

export class User {
    name: string 
    password: string
    id: string
    rooms: Room []

    constructor(name: string, password: string, id: string) {
        this.name = name
        this.password = password
        this.id = id
    }
}