import {Request,Response,NextFunction} from "express";
import {CreateVendorInput} from "../dto"
import {Vendor} from '../models';
import {GenerateSalt, GeneratePassword} from "../utility"


export const findVendor=async(id:string|undefined, email?:string)=>{

    if(email){
        const vendor=await Vendor.findOne({email:email})
        return vendor;
    }else{
        const vendor=await Vendor.findById(id)
        return vendor

}

}
export const CreateVendor=async(req:Request,res:Response,next:NextFunction)=>{
    
    try{

        const {name, ownerName, email ,foodTypes, pincode, address,phone, password}= <CreateVendorInput>req.body;
        const existingVendor=await findVendor('',email)

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
            foodTypes:foodTypes, 
            pincode:pincode, 
            address:address,
            phone:phone, 
            password:hashedPassword,
            rating:0,
            serviceAvailable:false,
            salt:salt,
            coverImages:[],
            foods:[]
            


        })
        res.send(newVendor)
        return;

    }catch(error){
        if(error){
            res.send({success:false, message:error})
        }
    }
    }
    
    export const GetVendors=async(req:Request,res:Response,next:NextFunction)=>{

        try{
       const vendors=await Vendor.find()
       if(vendors!==null){
        res.send(vendors)
        return;
       }
       res.send({message:"there is no vendor data available"})
        }catch(error){
            if(error){
                console.log("error: ",error)
            }

        }
    
        
    }
    
    export const GetVendorByID=async(req:Request,res:Response,next:NextFunction)=>{
       
        try{
            const vendorId=req.params.id
            const vendor=await findVendor(vendorId)
            if(vendor!==null){
                res.send(vendor)
                return;
            }
            res.send({message:"Vendor data is not available"})
            return;

        }catch(error){
            if(error){
                console.log("error: ",error)
            }
        }        
    }