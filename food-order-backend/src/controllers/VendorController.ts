import {Request,Response, NextFunction} from "express";
import {VendorLoginInputs,EditVendorInputs} from "../dto";
import {findVendor} from "."
import {ValidatePassword,GenerateSignature} from "../utility"
import { Vendor,Food } from "../models";
import { CreateFoodInputs } from "../dto/Food.dto";


export const VendorLogin=async(req:Request,res:Response,next:NextFunction)=>{

    const {email,password}= <VendorLoginInputs> req.body;
        const existingVendor= await findVendor("",email)
        if(existingVendor!==null){
            //validate and give acces
       const validation= await ValidatePassword(password,existingVendor.password,existingVendor.salt)
       if(validation){
            
            const signature= await GenerateSignature({
                _id:existingVendor.id,
                foodTypes:existingVendor.foodTypes,
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
    const user=req.user;
    if(user){
       const existingVendor=await findVendor(user._id)
       if(existingVendor!==null){
            res.send(existingVendor)
            return;
       }
       res.send({message:"Vendor information not found"});
       return;
    }else{
        res.send({message:"User is not authorized"})
        return;
    }




}

export const UpdateVendorProfile=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const user=req.user;

   const {name,foodTypes,address,phone} =<EditVendorInputs>req.body


   if(user){
    const existingVendor=await findVendor(user._id)
    if(existingVendor!==null){
        existingVendor.name=name
        existingVendor.foodTypes=foodTypes
        existingVendor.address=address
        existingVendor.phone=phone
        
       const savedResults=await existingVendor.save()
       res.send(savedResults)
       return ;
    }else{
        res.send({message:"this user doesnt exist",success:false})
        return;
    }
   } else{
    console.log('U need to first sign in!')
    return;
   }
    }catch(error){
        if(error){
            console.log("Error: ",error)
        }

    }
}

export const UpdateVendorService=async(req:Request,res:Response,next:NextFunction)=>{

    try{
        const user=req.user;

   if(user){
    const existingVendor=await findVendor(user._id)
    if(existingVendor!==null){
        existingVendor.serviceAvailable=!existingVendor.serviceAvailable
       const savedResults=await existingVendor.save()
       res.send(savedResults)
       return ;
    }else{
        res.send({message:"this user doesnt exist",success:false})
        return;
    }
   } else{
    console.log('U need to first sign in!')
    return;
   }
    }catch(error){
        if(error){
            console.log("Error: ",error)
        }

    }

}

export const UpdateVendorCoverImage=async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.user
    console.log('this is the user',user)
    if(user){
        const existingVendor=await findVendor('',user._id)
        if (existingVendor!==null){
            const files=req.files as [Express.Multer.File]
            const images=files.map(file=>{
                return file.originalname
            })

            existingVendor.coverImages.push(...images)
          const result=await existingVendor.save()
          res.json(result)
          return;
        }
        res.json('the vendor information doesnt exist')
        return
    }else{
        res.json({message:"User is not authorized"})
        return
    }
    

}
export const AddFood=async(req:Request,res:Response,next:NextFunction)=>{

    const user=req.user
    console.log('im ina dd food')

    
    if(user){       
        const files=req.files as [Express.Multer.File]
       
        console.log("this is files", files)
       
         
         const images=files.map((file:Express.Multer.File)=>{
          
            files.forEach(file => console.log('Uploaded file path:', file.path));

            return file.filename
            


         })

        console.log("this is images", images)



       
        const {name,description,category,foodType,readyTime,price}=<CreateFoodInputs>req.body
        const vendor= await findVendor(user._id)
        if(vendor!==null){
            const createdFood= await Food.create({
                vendorId:vendor._id,
                name:name,
                description:description,
                category:category,
                foodType:foodType,
                readyTime:readyTime,
                price:price,
                images:images,
                rating:0
            })
            vendor.foods.push(createdFood)
            const result=await vendor.save()

            res.send({message:"successfully added a new food",createdFood:result})
            return;

        }
       
        res.send({message:"Failed at creating a new food. Vendor information not available."})
        return;
    }

}

export const GetFoods=async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.user
    if(user){  
        const foods=await Food.find({vendorId:user._id})
        console.log('this is foods',foods )
        if(foods!==null){
            res.send({foods:foods})
            return;

        }
        res.send({message:"no food under that vendor"})
        return;
    }
}
