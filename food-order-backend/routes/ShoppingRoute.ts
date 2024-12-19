import express,{Request,Response,NextFunction} from "express";

const router=express.Router();

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    console.log('this is the shopping router')

})

export {router as ShoppingRouter}