import  {Request,Response,NextFunction} from "express";

import {Offer, Vendor,foodDoc} from "../models"

export const GetFoodAvailability=async(req:Request,res:Response,next:NextFunction)=>{
    const pincode=req.params.pincode;
    const result= await Vendor.find({pincode:pincode, serviceAvailable:true})
    .sort([["rating","descending"]])
    .populate('foods')
    if(result.length>0){
        res.status(200).send(result);
        return;
    }
   res.status(400).json({"message":"Data not found"})
   return;

}
export const GetTopRestaurants=async(req:Request,res:Response,next:NextFunction)=>{
    const pincode=req.params.pincode;
    const result= await Vendor.find({pincode:pincode, serviceAvailable:false})
    .sort([["rating","descending"]])
    .limit(1)
    if(result.length>0){
        res.status(200).send(result);
        console.log('This is the top 1 restaurant: ', result)
        return;
    }
   res.status(400).json({"message":"Data not found"})
   return;

}
export const GetFoodsIn30mins=async(req:Request,res:Response,next:NextFunction)=>{
    const pincode=req.params.pincode;
    const result=await Vendor.find({pincode:pincode,serviceAvailable:false})
    .populate('foods')
if(result.length>0){
    let foodResults:any=[];
    result.map((vendor)=>{
        const foods=vendor.foods as [foodDoc]
        foodResults.push(...foods.filter(food=>food.readyTime<=30))
    })
     res.status(200).send(foodResults)
     return;

}
 res.status(400).send({"message":"Data not found"})
 return;    

}
export const SearchFoods=async(req:Request,res:Response,next:NextFunction)=>{
    const pincode=req.params.pincode
    const result=await Vendor.find({pincode:pincode,serviceAvailable:false})
    .populate('foods')

    if(result.length>0){
        let foodResult:any=[];
        result.map((vendor)=>{
            const food=vendor.foods
            foodResult.push(...food)

        })
        res.status(200).send(foodResult);
        return;

    }
    res.status(400).send({message:"Data not found"})


}
export const RestaurantsById=async(req:Request,res:Response,next:NextFunction)=>{
    const {pincode}=req.params
    const {id}=req.params
    const result=await Vendor.findById(id).populate('foods')

    if(result){
        res.status(200).send(result);
        return;

    }
    res.status(400).send({message:"Data not found"})
    return;

}

/**********************Offer section****************************/

// export const GetOffers=async(req:Request,res:Response,next:NextFunction)=>{


// }

export const GetAvailableOffers=async(req:Request,res:Response,next:NextFunction)=>{

    const pincode=req.params.pincode

    if(pincode){
        const offers=await Offer.find({pincode, isActive:false}).populate('vendors')
        if(offers!==null){
            res.status(200).send(offers)
            return;
            
        }
    }
    res.status(400).send({message:"Data not found"})
    return;
    
}