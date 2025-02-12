import "next-auth"
import { DefaultSession } from "next-auth";

declare module 'next-auth'{
    // why User or why not interface user
    interface User {
        _id? : string;
        username? : string;
        isAcceptingMessages? : boolean;
        isVerified? :boolean;
    }
    
    // again same, error for session but not for Session
    interface Session {
        user : {
            _id? : string;
            username? : string;
            isAcceptingMessages? : boolean;
            isVerified? :boolean;
        } & DefaultSession["user"]
    }
}

declare module 'next-auth/jwt'{
    //after all, it's an framework, not to blame...
    interface JWT{
        _id? : string;
        username? : string;
        isAcceptingMessages? : boolean;
        isVerified? :boolean;
    }
}