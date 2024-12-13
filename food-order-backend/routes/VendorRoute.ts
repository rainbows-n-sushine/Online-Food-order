import express,{Request, Response, NextFunction} from 'express';
import {VendorLogin} from "../controllers"
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService } from '../controllers';
import { Authenticate } from '../middlewares';

const router= express.Router();
router.use(Authenticate)
router.post('/login',VendorLogin);
router.get('/profile',GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/service', UpdateVendorService)

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json('Welcome to the vendor route')
    
})
export {router as VendorRouter}