import express,{Application} from "express";
import {AdminRouter, VendorRouter,ShoppingRouter} from "../routes";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import path from "path"

dotenv.config();

export default async(app:Application)=>{
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/images",express.static(path.join(__dirname,"images")))

app.use("/admin", AdminRouter);
app.use('/vendor',VendorRouter);
app.use('/shopping',ShoppingRouter)
return app;

}