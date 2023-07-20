import { v4 as uuidv4 } from "uuid";

export class IDGenerator {
	generate(): string {
		const id = uuidv4();

		return id;
	}
}