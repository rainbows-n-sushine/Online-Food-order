import express from "express";
import {AdminRouter, VendorRouter} from "./routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {MONGO_URI} from "./config"
import dotenv from 'dotenv';
import path from "path"

dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/images",express.static(path.join(__dirname,"images")))

app.use("/admin", AdminRouter);
app.use('/vendor',VendorRouter);
const PORT = process.env.PORT || 3000;
 
mongoose.connect(MONGO_URI,{
  autoIndex:true,
  autoCreate:true,
  user:process.env.USER,
  pass:process.env.PASS
}).then(()=>{
  console.log("Mongoose is connected :)")
}).catch((err)=>{
  console.log('error ',err)
})

app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running on port ${PORT}`);
});