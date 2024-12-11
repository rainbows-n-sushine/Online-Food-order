import express, { Request, Response } from "express";
import {AdminRouter, VendorRouter} from "./routes";
import bodyParser from "body-parser";
import mongoose,{ConnectOptions} from "mongoose";
import {MONGO_URI} from "./config"

const app = express();
const PORT = process.env.PORT || 8000;

// app.use(express.json());
// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/admin", AdminRouter);
app.use('/vendor',VendorRouter);
 
mongoose.connect(MONGO_URI,{
  autoIndex:true,
  autoCreate:true,
  user:'jayaddisu',
  pass:"jayaddisu5353"
}).then((result)=>{
  console.log("Mongoose is connected :)")
}).catch((err)=>{
  console.log('error ',err)
})

app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running on port ${PORT}`);
});