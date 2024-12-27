import {Request,Response, NextFunction} from "express";
import {VendorLoginInputs,EditVendorInputs, ProcessOrderInputs} from "../dto";
import {findVendor} from "."
import {ValidatePassword,GenerateSignature} from "../utility"
import { Vendor,Food, Order,Offer } from "../models";
import { CreateFoodInputs,CreateOfferInputs } from "../dto";
import { read } from "fs";


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

export const GetCurrentOrders=async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.user

    if(user){
        const orders=await Order.find({vendorId:user._id}).populate('items.food')
        if(orders!==null){
            res.status(200).send(orders);
            return;
        }
        
    }
    res.status(400).json({message:"Orders can not be found"})
    return;
}

export const GetOrderDetails=async(req:Request,res:Response,next:NextFunction)=>{
    const orderId=req.params.id

    if(orderId){
        const order=await Order.findById(orderId).populate('items.food')
        if(order!==null){
            res.status(200).send(order);
            return;
        }
        
    }
    res.status(400).json({message:"Order can not be found"})
    return;

    
}

export const ProcessOrder=async(req:Request,res:Response,next:NextFunction)=>{
    const orderId=req.params.id
    if(orderId){
        const order=await Order.findById(orderId).populate('items.food')
        const {status,time,remarks}=<ProcessOrderInputs>req.body
        if(order){
            order.orderStatus=status
            order.remarks=remarks
            if(time){
                order.readyTime=time
            }
            const orderResult=await order.save()
            if(orderResult){
              res.status(200).send(orderResult)
            return;  
            }
            
        }
    }
res.status(400).json({message:"Unable to process order"})
return;   
}

//***********************Offer section************************/
export const AddOffer=async(req:Request,res:Response,next:NextFunction)=>{
const user=req.user
if(user){
    const { offerType,vendors,title,description, minValue, offerAmount,startValidity,endValidity,promocode,promotype,
        bank,bins,pincode,isActive}=<CreateOfferInputs>req.body
        const vendor=await findVendor(user._id)
        if(vendor){
            const offer=await Offer.create({
                offerType,
                vendors:[vendor],
                title,
                description,
                minValue,
                offerAmount,
                startValidity,
                endValidity,
                promocode,
                promotype,
                bank,
                bins,
                pincode,
                isActive
            })
         
            res.status(200).send(offer)
            return;
        }

}
res.status(400).json({message:"Unable to add offers"})
    
}
export const GetOffers=async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.user
   
    if(user){
     const offers=await Offer.find().populate('vendors')
        let currentOffers=Array()
         if (offers!== null){
            offers.map(offer=>{
                offer.vendors.map(vendor=>{
                    if(vendor._id.toString()===user._id){
                        currentOffers.push(offer)
                    }
                })
                if(offer.offerType==="GENERIC"){
                    currentOffers.push(offer)

                }
            })

            res.status(200).send(currentOffers)
            return;
          
        }

    }
    res.status(400).json({message:"Error in fetching offers"})



}
export const EditOffer=async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.user
    const offerId=req.params.id
    if(user && offerId){
        const { offerType,vendors,title,description, minValue, offerAmount,startValidity,endValidity,promocode,promotype,
            bank,bins,pincode,isActive}=<CreateOfferInputs>req.body
            const vendor=await findVendor(user._id)
            if(vendor){
                const offer=await Offer.findById(offerId).populate('vendors')
                
                   offer.offerType= offerType
                    offer.vendors=vendors
                    offer.title=title
                    offer.description=description
                    offer.minValue=minValue
                    offer.offerAmount=offerAmount
                    offer.startValidity=startValidity
                    offer.endValidity=endValidity
                    offer.promocode=promocode
                    offer.promotype=promotype
                    offer.bank=bank
                    offer.bins=bins
                    offer.pincode=pincode
                    offer.isActive=isActive
                    const offerResult= await offer.save();
                    res.status(200).send(offerResult)
                    return;
            }
    
    }
    res.status(400).json({message:"Unable to add offers"})
    return;
        
    
}