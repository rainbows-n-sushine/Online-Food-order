import express,{ Request,Response,NextFunction } from "express";
import {CustomerSignUp,CustomerLogin,CustomerVerify,RequestOTP,GetCustomerProfile,EditCustomerProfile, GetOrders, CreateOrders,GetOrder,GetCart,AddToCart,DeleteCart} from "../controllers";
import { Authenticate } from "../middlewares";

const router=express.Router()

/** **/
/** Sign Up/create customer**/
router.post('/signup',CustomerSignUp);
/**Login **/
router.post('/login',CustomerLogin)

//need to get Authenticated
router.use (Authenticate)
/** Verify customer Account**/
router.patch('/verify',CustomerVerify)
/** OTP/Requesting OTP**/
router.get('/otp',RequestOTP)

/** Profile **/
router.get('/profile',GetCustomerProfile)
router.patch('/profile',EditCustomerProfile)

//Cart
router.post('/cart',AddToCart)
router.get('/cart',GetCart)
router.delete('/delete',DeleteCart)
//Payment
//Order
router.post('/create-order',CreateOrders)
router.get('/orders',GetOrders)
router.get('/order/:id',GetOrder)



export {router as CustomerRoute}





