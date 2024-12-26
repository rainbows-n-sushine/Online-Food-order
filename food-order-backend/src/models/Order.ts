import mongoose,{Model,Document,Schema} from "mongoose";


export interface OrderDoc extends Document{
   orderId:string, //98736
   vendorId:string,
   items:[any], //{food,unit}
   totalAmount:number, //600.00
   orderDate:Date,//Date 
   paidThrough:string, //COD ,CARD,NET BANKING,WALLET
   paymentResponse:string,//long response object for response scenario 
   orderStatus:string,///to determine the current status// waiting //failed//delivered//onway//preparing
   remarks:string,
   deliveryId:string,
   appliedOffers:boolean,
   offerId:string,
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
    orderDate:{type:Date, required:true},
    paidThrough:{type:String, required:true},
    paymentResponse:{type:String},
    orderStatus:{type:String},
    remarks:{type:String},
    deliveryId:{type:String},
    appliedOffers:{type:Boolean},
    offerId:{type:String},
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