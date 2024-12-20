import express,{Application} from "express";
import {AdminRoute, VendorRoute,ShoppingRoute} from "../routes";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import path from "path"

dotenv.config();

export default async(app:Application)=>{
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/images",express.static(path.join(__dirname,"images")))

app.use("/admin", AdminRoute);
app.use('/vendor',VendorRoute);
app.use(ShoppingRoute)
return app;

}