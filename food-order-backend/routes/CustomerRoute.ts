import express,{ Request,Response,NextFunction } from "express";
import {CustomerSignUp,CustomerLogin,CustomerVerify,RequestOTP,GetCustomerProfile,EditCustomerProfile} from "../controllers";

const router=express.Router()

/** **/
/** Sign Up/create customer**/
router.post('/signup',CustomerSignUp);
/**Login **/
router.post('/login',CustomerLogin)
/** Verify customer Account**/
router.patch('/verify',CustomerVerify)
/** OTP/Requesting OTP**/
router.get('/otp',RequestOTP)

/** Profile **/
router.get('/profile',GetCustomerProfile)
router.patch('/profile',EditCustomerProfile)

//Cart
//Order
//Payment



export {router as CustomerRoute}





