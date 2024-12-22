import express,{Application} from "express";
import {AdminRoute, VendorRoute,ShoppingRoute,CustomerRoute} from "../routes";
import dotenv from 'dotenv';
import path from "path"

dotenv.config();

export default async(app:Application)=>{
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/images",express.static(path.join(__dirname,"images")))

app.use("/admin", AdminRoute);
app.use('/vendor',VendorRoute);
app.use('/customer',CustomerRoute);
app.use(ShoppingRoute)
return app;

}