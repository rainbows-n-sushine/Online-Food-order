import express, { Request, Response } from "express";
import {AdminRouter, VendorRouter} from "./routes";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8000;

// app.use(express.json());
// app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/admin", AdminRouter);
app.use('/vendor',VendorRouter);

app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running on port ${PORT}`);
});