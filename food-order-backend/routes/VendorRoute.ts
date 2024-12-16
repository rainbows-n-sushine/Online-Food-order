import express,{Request, Response, NextFunction} from 'express';
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService ,AddFood,VendorLogin,GetFoods,UpdateVendorCoverImage} from '../controllers';
import { Authenticate } from '../middlewares';
import multer from "multer";

const router= express.Router();

const imageStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },
    filename:(req,file,cb)=>{
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const newFilename = `${timestamp}_${file.originalname}`;
        cb(null, newFilename);
    }
})
const images=multer({storage:imageStorage}).array("images",10)

router.post('/login',VendorLogin);
router.use(Authenticate)

router.get('/profile',GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/service', UpdateVendorService)
router.patch('/coverimage',images,UpdateVendorCoverImage)
router.post('/food',images,AddFood)
router.get("/foods",GetFoods)

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json('Welcome to the vendor route')
    
})
export {router as VendorRouter}