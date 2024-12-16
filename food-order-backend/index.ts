import express from "express";
import App from "./services/ExpressApp"
import DbConnection from "./services/Database"
import dotenv from 'dotenv';


dotenv.config();

const StartServer=async()=>{
  
const PORT = process.env.PORT || 3000;
 
  const app=express()
  await DbConnection();
  await App(app)
  app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on port ${PORT}`);
  });


}

StartServer()


