import {Request,Response,NextFunction} from "express"
import {CreateVendorInput} from "../dto"
import {Vendor} from '../models';
import {GenerateSalt, GeneratePassword} from "../utility"


export const CreateVendor=async(req:Request,res:Response,next:NextFunction)=>{
    
    try{

        const {name, ownerName, email ,foodType, pincode, address,phone, password}= <CreateVendorInput>req.body;
        const existingVendor=await Vendor.findOne({email:email})

        if(existingVendor!==null){
             res.json({"message":"there is already a vendor under the same email"})
             return;
        }
   //generate salt
   const salt=await GenerateSalt();
    const hashedPassword=await GeneratePassword(password,salt)


        const newVendor= await Vendor.create({
            name:name,
            ownerName:ownerName, 
            email:email ,
            foodType:foodType, 
            pincode:pincode, 
            address:address,
            phone:phone, 
            password:hashedPassword,
            rating:0,
            serviceAvailable:false,
            salt:salt,
            coverImages:[]


        })
        res.send(newVendor.toJSON())
        console.log(newVendor)
        return;

    }catch(error){
        if(error){
            res.send({success:false, message:error})
        }

    }
    

    }
    
    export const GetVendors=async(req:Request,res:Response,next:NextFunction)=>{
    
        
    }
    
    export const GetVendorByID=async(req:Request,res:Response,next:NextFunction)=>{
        
    
        
    }