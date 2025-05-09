import { AuthPayload } from "../dto"
import { Request,Response,NextFunction } from "express"
import { ValidateSignature } from "../utility"

declare global{
    namespace Express{
     interface Request{
        user?:AuthPayload
     }
    }
}

 export const Authenticate=async(req:Request,res:Response,next:NextFunction)=>{
 
     const validate=await ValidateSignature(req)
     if(validate){
       next();

     }
     else{
        res.send({message:"user is not authorized"})
        return;
     }




 }