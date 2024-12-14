import express,{Request, Response, NextFunction} from 'express';
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService ,AddFood,VendorLogin,GetFoods} from '../controllers';
import { Authenticate } from '../middlewares';
import multer from "multer";

const router= express.Router();

const imageStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
      //cb(null,new Date().toISOString()+"_"+file.originalname)
    }
})
const images=multer({storage:imageStorage}).array("images",10)

router.post('/login',VendorLogin);
router.use(Authenticate)

router.get('/profile',GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/service', UpdateVendorService)

router.post('/food',images,AddFood)
router.get("/foods",GetFoods)

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json('Welcome to the vendor route')
    
})
export {router as VendorRouter}