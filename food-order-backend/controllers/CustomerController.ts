import {Response ,Request,NextFunction} from "express";
import {CreateCustomerInputs} from "../dto"
import {plainToClass} from "class-transformer"
import { validate } from "class-validator";
import { GenerateSalt,GeneratePassword, GenerateSignature,GenerateOTP, OnRequestOTP } from "../utility";
import {Customer} from "../models"

export const CustomerSignUp=async(req:Request,res:Response,next:NextFunction)=>{

    const customerInputs= plainToClass(CreateCustomerInputs,req.body);
    const inputErrors= await validate(customerInputs,{validationError:{target:true}})
    if(inputErrors.length>0){
        res.json(inputErrors)
        return;
    }
 const {password,email,phone}=customerInputs
 const salt =await GenerateSalt()
 const userPassword=await GeneratePassword(password,salt)

 const {otp, expiry}=GenerateOTP()
   const existingCustomer= await Customer.findOne({email:email})
   if (existingCustomer!==null){
    res.status(400).json({message:"customer with similar email exists"})
    return;
   }
 const NewCustomer=await Customer.create({
    email:email,
    password:password,
    firstName:"",
    lastName:'',
    address:"",
    phone:phone,
    verified:false,
    otp:otp,
    otp_expiry:expiry,
    lat:0,
    lng:0


 })

    if(NewCustomer){
        console.log(NewCustomer)
        //send the OTP to customer
 await OnRequestOTP(otp,phone)
        
        //generate Signature
        const signature= await GenerateSignature({
            _id:NewCustomer._id,
            email:NewCustomer.email,
            verified:NewCustomer.verified



        })
        res.status(200).json({signature:signature,verified:NewCustomer.verified,email:NewCustomer.email})
        //send the result to client
        return;

    }
    res.status(200).json ({message:"Invalid data"})



}
export const CustomerLogin=async(req:Request,res:Response,next:NextFunction)=>{


}
export const CustomerVerify=async(req:Request,res:Response,next:NextFunction)=>{

    const {otp}=req.body
    const customer=req.user

  if(customer){
    const profile=await Customer.findById(customer._id)
    if(profile){
        if(profile.otp===parseInt(otp) && profile.otp_expiry>=new Date()){
            profile.verified=true
           const updatedCustomer= await profile.save()

            const signature=await GenerateSignature({
                verified:updatedCustomer.verified,
                _id:updatedCustomer._id,
                email:updatedCustomer.email

            })
            res.status(200).json({verified:updatedCustomer.verified,signature:signature,email:updatedCustomer.email})
            return;

        }
    }
    res.status(400).json({message:"Otp validation failed"})
    
    return; 

  }
   
    


}
export const RequestOTP=async(req:Request,res:Response,next:NextFunction)=>{


}
export const GetCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{


}
export const EditCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{


}
