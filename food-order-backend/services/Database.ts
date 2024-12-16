
import mongoose from "mongoose";
import {MONGO_URI} from "../config"
import dotenv from 'dotenv';

dotenv.config();

export default async()=>{
  try{
     mongoose.connect(MONGO_URI,{
    autoIndex:true,
    autoCreate:true,
    user:process.env.USER,
    pass:process.env.PASS
  })
  console.log('mongo db is connected:)')
  }catch(ex){
   console.log(ex)
  }
 
  
}

 

