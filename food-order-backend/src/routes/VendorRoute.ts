import express,{Request, Response, NextFunction} from 'express';
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService ,AddFood,
    VendorLogin,GetFoods,UpdateVendorCoverImage, GetCurrentOrders, ProcessOrder,
    GetOrderDetails
} from '../controllers';
import { Authenticate } from '../middlewares';
import multer from "multer";
import path from 'path';

const router= express.Router();

const imageStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname, '../images'))
    },
    filename:(req,file,cb)=>{
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const newFilename = `${timestamp}_${file.originalname}`;
        cb(null, newFilename);
        // cb(null,new Date().toISOString()+"_"+ file.originalname)
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
//Orders
router.get('/orders',GetCurrentOrders)
router.put('/order/:id/process',ProcessOrder)
router.get('/order/:id',GetOrderDetails)

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json('Welcome to the vendor route')
    
})
export {router as VendorRoute}