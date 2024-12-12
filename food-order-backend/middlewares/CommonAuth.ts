import { AuthPayload } from "../dto"

declare namespace global{
    namespace Express{
     interface Request{
        user?:AuthPayload
     }
    }
}