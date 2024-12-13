import express,{Request, Response, NextFunction} from 'express';
import {VendorLogin} from "../controllers"
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService } from '../controllers';
import { Authenticate } from '../middlewares';

const router= express.Router();
router.post('/login',VendorLogin);
router.get('/profile',Authenticate,GetVendorProfile)
router.patch('/profile',Authenticate, UpdateVendorProfile)
router.patch('/service',Authenticate, UpdateVendorService)

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json('Welcome to the vendor route')
    
})
export {router as VendorRouter}