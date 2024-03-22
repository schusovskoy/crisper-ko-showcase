import { Exception } from "crisper.std/Exception";

export class SocialException extends Exception {
    constructor(message: string) {
        super(message);
    }
}