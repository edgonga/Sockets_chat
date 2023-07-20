export class Message {
    id: string
    content: string
    sender: string
    timestamp

    constructor(id: string, content: string, sender: string, timestamp: string) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.timestamp = timestamp;
    }
}