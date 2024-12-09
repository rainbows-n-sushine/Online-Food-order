import {Request,Response,NextFunction} from "express"
import {CreateVendorInput} from "../dto"
import {Vendor} from '../models'


export const CreateVendor=async(req:Request,res:Response,next:NextFunction)=>{
    
    try{
        const {name, ownerName, email ,foodType, pincode, address,phone, password}= <CreateVendorInput>req.body;
        // console.log(req.body)
        const createdVendor= await Vendor.create({
            name:name,
            ownerName:ownerName, 
            email:email ,
            foodType:foodType, 
            pincode:pincode, 
            address:address,
            phone:phone, 
            password:password,
            rating:0,
            serviceAvailable:false,
            salt:"",
            coverImages:[]


        })
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