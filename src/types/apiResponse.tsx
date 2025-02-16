import { Message } from "@/model/user.model";

export interface apiResponseSchema {
    success : boolean;
    statusCode : number;
    message : string;
    acceptingMessage? : boolean;
    messages? : Array<Message>;
}
