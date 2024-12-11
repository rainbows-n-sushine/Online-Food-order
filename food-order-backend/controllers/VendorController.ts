import {Request,Response, NextFunction} from "express";
import {VendorLoginInputs} from "../dto";
import {findVendor} from "./"
import {ValidatePassword} from "../utility"

export const VendorLogin=async(req:Request,res:Response,next:NextFunction)=>{

    const {email,password}= <VendorLoginInputs> req.body;
        const existingVendor= await findVendor("",email)
        if(existingVendor!==null){
            //validate and give acces
       const validation= await ValidatePassword(password,existingVendor.password,existingVendor.salt)
       if(validation){
            res.send({success:true, message:"Login successful", vendor:existingVendor})
            return;
        }
        else{
            res.send({success:false, message:"Password is invalid"})
            return;
        }
        }
        res.send({message:"incorrect credentials"})
        return;

}
