import {Request,Response,NextFunction} from "express"
import {CreateVendorInput} from "../dto"


export const CreateVendor=async(req:Request,res:Response,next:NextFunction)=>{
    
    try{
        const {name, ownerName, email ,foodType, pincode, address,phone, password}= <CreateVendorInput>req.body;
        // console.log(req.body)
        res.send({name, ownerName, email ,foodType, pincode, address,phone, password})
        return;

    }catch(error){
        if(error){
            res.send({success:false, message:error})
        }

    }
    
  
   
    // console.log({name, ownerName, email ,foodType, pincode, address,phone, password})
    // return;
    }
    
    export const GetVendors=async(req:Request,res:Response,next:NextFunction)=>{
    
        
    }
    
    export const GetVendorByID=async(req:Request,res:Response,next:NextFunction)=>{
        
    
        
    }