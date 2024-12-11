import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {APP_SECRET} from "../config";
import {VendorPayload} from "../dto"

export const GenerateSalt=async()=>{
    const salt=await bcrypt.genSalt()
 return salt;
}
export const GeneratePassword=async(password:string,salt:string)=>{
     const hashedPassword=await bcrypt.hash(password,salt)
     return hashedPassword;
}

export const ValidatePassword=async(enteredPassword:string,savedPassword:string, salt:string)=>{
    const passwordEntered=await GeneratePassword(enteredPassword,salt)
    return passwordEntered===savedPassword;

}
export const GenerateSignature=async(payload:VendorPayload)=>{
    const signature=  jwt.sign(payload,APP_SECRET,{expiresIn:"1d"})
        return signature 

}