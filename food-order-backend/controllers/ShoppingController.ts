import  {Request,Response,NextFunction} from "express";

import {Vendor} from "../models"

export const GetFoodAvailability=async(req:Request,res:Response,next:NextFunction)=>{
    const pincode=req.params.pincode;
    const result= await Vendor.find({pincode:pincode, serviceAvailable:true})
    .sort([["rating","descending"]])
    .populate('foods')
    if(result.length>0){
        res.status(200).send(result);
        console.log('this is foods in get food availability: ', result)
        return;
    }
   res.status(400).json({"message":"Data not found"})
   return;

}
export const GetTopRestaurants=async(req:Request,res:Response,next:NextFunction)=>{

}
export const GetFoodsIn30mins=async(req:Request,res:Response,next:NextFunction)=>{

}
export const SearchFoods=async(req:Request,res:Response,next:NextFunction)=>{

}
export const RestaurantsById=async(req:Request,res:Response,next:NextFunction)=>{

}
