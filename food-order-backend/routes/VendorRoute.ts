import express,{Request, Response, NextFunction} from 'express';
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService ,AddFood,VendorLogin,GetFoods} from '../controllers';
import { Authenticate } from '../middlewares';

const router= express.Router();
router.use(Authenticate)
router.post('/login',VendorLogin);
router.get('/profile',GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/service', UpdateVendorService)

router.post('/food',AddFood)
router.get("/foods",GetFoods)

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json('Welcome to the vendor route')
    
})
export {router as VendorRouter}