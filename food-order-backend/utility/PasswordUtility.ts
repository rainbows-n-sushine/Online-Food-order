import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {APP_SECRET} from "../config";
import {AuthPayload, VendorPayload} from "../dto"
import { Request } from 'express';

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
    const signature=  jwt.sign(payload,APP_SECRET,{expiresIn:"5d"})
        return signature 

}

export const ValidateSignature=async(req:Request)=>{
    const signature=req.get('Authorization');
    console.log('this is signature: ',signature)

    if(signature){
        const token= signature.split(" ")[1]
        const payload= await jwt.verify(token,APP_SECRET) as AuthPayload 
        console.log("this is auth payload"+payload)
        req.user=payload;
        console.log('this is user: ',req.user)
        return true;

    }
    return false;

}