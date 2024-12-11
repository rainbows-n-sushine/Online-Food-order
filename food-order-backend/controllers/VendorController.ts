import {Request,Response, NextFunction} from "express";
import {VendorLoginInputs} from "../dto";
import {findVendor} from "./"
import {ValidatePassword,GenerateSignature} from "../utility"


export const VendorLogin=async(req:Request,res:Response,next:NextFunction)=>{

    const {email,password}= <VendorLoginInputs> req.body;
        const existingVendor= await findVendor("",email)
        if(existingVendor!==null){
            //validate and give acces
       const validation= await ValidatePassword(password,existingVendor.password,existingVendor.salt)
       if(validation){
            
            const signature= await GenerateSignature({
                _id:existingVendor.id,
                foodType:existingVendor.foodType,
                name:existingVendor.name,
                email:existingVendor.email,

            })
            res.send({success:true, message:"Login successful", vendor:existingVendor, signature:signature})
           
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

export const GetVendorProfile=async(req:Request,res:Response,next:NextFunction)=>{



}

export const UpdateVendorProfile=async(req:Request,res:Response,next:NextFunction)=>{
    

}

export const UpdateVendorService=async(req:Request,res:Response,next:NextFunction)=>{
    

}