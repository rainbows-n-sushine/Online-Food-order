import express from "express";
import App from "./services/ExpressApp"
import DbConnection from "./services/Database"
import {PORT} from "./config"


const StartServer=async()=>{

 
  const app=express()
  await DbConnection();
  await App(app)
  app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on Render Server port ${PORT}`);
  });


}

StartServer()


