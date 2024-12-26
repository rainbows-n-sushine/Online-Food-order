import {Response ,Request,NextFunction} from "express";
import {CreateCustomerInputs,UserLoginInputs,EditCustomerProfileInputs,OrderInputs} from "../dto"
import {plainToClass} from "class-transformer"
import { isNotEmpty, validate } from "class-validator";
import { GenerateSalt,GeneratePassword, GenerateSignature,GenerateOTP, OnRequestOTP, ValidateSignature,ValidatePassword } from "../utility";
import {Customer,Order,Food} from "../models"

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
    password:userPassword,
    firstName:"",
    salt:salt,
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
 

    const loginInputs=plainToClass(UserLoginInputs,req.body)
    const loginErrors=await validate(loginInputs,{validationError:{target:false}})
    if (loginErrors.length>0){
        res.status(400).send(loginErrors)
        return;
    }
    console.log('We are in here')
    const{password,email}=loginInputs
  const customer=await Customer.findOne({email:email})
  if(customer){
    const validation=await ValidatePassword(password,customer.password,customer.salt)
    if(validation){
        // const {otp,expiry}= await GenerateOTP()
        // customer.otp=otp
        // const updatedCustomer=await customer.save()
        // await OnRequestOTP(otp,updatedCustomer.phone)
        
        const signature=await GenerateSignature({
            _id:customer._id,
            email:customer.email,
            verified:customer.verified
        })
        res.status(200).json({
            signature:signature,
            verfied:customer.verified,
            email:customer.email

        })
        return;

    }
    res.status(400).json({message:"Login validation failed"})
    return;

  }

}
export const CustomerVerify=async(req:Request,res:Response,next:NextFunction)=>{

    const {otp}=req.body
    const customer=req.user

  if(customer){
    
    const profile=await Customer.findById(customer._id)
    if(profile!==null){
        if(profile.otp===parseInt(otp) && profile.otp_expiry>=new Date()){
            profile.verified=true
           const updatedCustomer= await profile.save()

            const signature=await GenerateSignature({
                verified:updatedCustomer.verified,
                _id:updatedCustomer._id,
                email:updatedCustomer.email

            })
            res.status(201).json({verified:updatedCustomer.verified,signature:signature,email:updatedCustomer.email})
            return;

        }
    }
    res.status(404).json({message:"Login error"})
    
    return; 

  }
   
    


}
export const RequestOTP=async(req:Request,res:Response,next:NextFunction)=>{
    const customer=req.user

    if(customer){
        const profile=await Customer.findById(customer._id)
        if(profile){
            const {otp,expiry}=GenerateOTP()
            profile.otp=otp
            profile.otp_expiry=expiry
         await profile.save()
         OnRequestOTP(profile.otp,profile.phone)
         res.status(201).json({message:"the otp is sent to your registered number"})
         return
        }
    }
    res.status(400).json({message:"Error in sending otp"})
    


}
export const GetCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.user
 

        if (user){
            const customer=await Customer.findById(user._id)
            if(customer){
                res.status(200).send(customer)
                return
            }

        }
        res.status(400).send("Error fetching profile") 
        return;



}
export const EditCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{
  const customer=req.user
  const profileInputs=plainToClass(EditCustomerProfileInputs,req.body)
  const profileErrors=await validate(profileInputs,{validationError:{target:false}})
  if(profileErrors.length>0){
    res.status(400).send(profileErrors)
    return;

  }
  if(customer){
    const profile= await Customer.findById(customer._id)
  if(profile){
    const {firstName,lastName,address}=profileInputs
    profile.firstName=firstName
    profile.lastName=lastName
    profile.address=address
    const updatedProfile=await profile.save()
    res.status(200).send( updatedProfile )

  }

  }
  res.status(400).json({message:"Error in editing teh profile"})
  
}

export const CreateOrders=async(req:Request,res:Response,next:NextFunction)=>{
//Grab current login customer
const customer=req.user
if (customer){
  const orderId=`${Math.floor(Math.random()*89999+1000)}`
  const cart=<[OrderInputs]>req.body
  console.log('this is above the customers id')
  const profile=await Customer.findById(customer._id)
  console.log('this is below the customers id')
  const foods=await Food.find().where('_id').in(cart.map(item=>item._id)).exec()
  let cartItems=Array()
  let netAmount=0.0;

    foods.map(food=>{
    cart.map(({_id, unit})=>{
      if(food._id==_id)
      netAmount+=(food.price*unit)
      cartItems.push({food,unit})
    })
  })
  if(cartItems){
  const currentOrder= await Order.create({
    orderId:orderId,
    items:cartItems,
    totalAmount:netAmount,
    orderDate:new Date(),
    paidThrough:"COD",
    paymentResponse:"",
    orderStatus:"waiting"

  })
  if(currentOrder){
    profile.orders.push(currentOrder)
    await profile.save()
    res.status(200).send(currentOrder)
    return;
  } 
  }   
}
res.status(400).json({
  message:"Error creating an order"
})
}

export const GetOrders=async(req:Request,res:Response,next:NextFunction)=>{
  const customer=req.user
  if(customer){
    const profile=await Customer.findById(customer._id).populate('orders')
    if(profile){
      res.status(200).send(profile.orders)
      return;
    }
  }
res.status(400).json({message:"Error fetching orders"})
return;
  

}

export const GetOrder=async(req:Request,res:Response,next:NextFunction)=>{
const orderId=req.params.id
if(orderId){
  const order=await Order.findById(orderId).populate('items.food')
  if(Order){
    res.status(200).send(order)
    return
   }
  
}
}
