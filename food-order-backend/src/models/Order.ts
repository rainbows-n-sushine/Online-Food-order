import mongoose,{Model,Document,Schema} from "mongoose";


export interface OrderDoc extends Document{
   orderId:string, //98736
   vendorId:string,
   items:[any], //{food,unit}
   totalAmount:number, //600.00
   paidAmount:number
   orderDate:Date,//Date 
   orderStatus:string,///to determine the current status// waiting //failed//delivered//onway//preparing
   remarks:string,
   deliveryId:string,
   readyTime:number//max 60 mniutes
}

const OrderSchema=new Schema({
    orderId:{type:String, required:true},
    vendorId:{type:String,required:true},
    items:[{
        food: {type:Schema.Types.ObjectId,required:true,ref:"food"},
        unit:{type:Number, required:true}
     }],
    totalAmount:{type:Number},
    paidAmount:{type:Number},
    orderDate:{type:Date, required:true},
    orderStatus:{type:String},
    remarks:{type:String},
    deliveryId:{type:String},
    readyTime:{type:Number},
},{toJSON:{
    transform(doc,ret){
        delete ret.updatedAt
        delete ret.createdAt,
        delete ret.__v

    }
},timestamps:true})

const Order=mongoose.model<OrderDoc>("order",OrderSchema)

export{Order}