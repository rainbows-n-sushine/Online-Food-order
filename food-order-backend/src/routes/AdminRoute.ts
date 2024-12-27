import express,{Request, Response, NextFunction} from 'express';
import {CreateVendor,GetTransaction,GetTransactions,GetVendorByID,GetVendors} from "../controllers"

const router= express.Router();

router.post('/vendor',CreateVendor);
router.get('/vendors',GetVendors);
router.get('/vendor/:id',GetVendorByID)

///Transaction info
router.get('/transactions',GetTransactions)
router.get('/transaction/:id',GetTransaction)


router.get('/',(req:Request,res:Response,next:NextFunction)=>{

    res.json("Welcome to the Admin route")

})

export {router as AdminRoute}