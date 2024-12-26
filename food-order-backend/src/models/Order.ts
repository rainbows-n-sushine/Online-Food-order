import mongoose,{Model,Document,Schema} from "mongoose";


export interface OrderDoc extends Document{
   orderId:string, //98736
   vendorId:string,
   items:[any], //{food:'}
   totalAmount:number,
   orderDate:Date,
   paidThrough:string,
   paymentResponse:string,
   orderStatus:string,
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
    orderStatus:{type:String}
},{toJSON:{
    transform(doc,ret){
        delete ret.updatedAt
        delete ret.createdAt,
        delete ret.__v

    }
},timestamps:true})

const Order=mongoose.model<OrderDoc>("order",OrderSchema)

export{Order}