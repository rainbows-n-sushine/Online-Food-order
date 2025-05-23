import mongoose,{Model,Schema,Document} from "mongoose"
import {OrderDoc} from "./"

export interface CustomerDoc extends Document{

    email:string
    password:string
    salt:string
    firstName:string
    lastName:string
    address:string
    phone:string
    verified:boolean
    otp:number
    otp_expiry:Date
    lat:number
    lng:number
    orders:[OrderDoc],
    cart:[any]

}

const CustomerSchema=new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    firstName:{type:String},
    lastName:{type:String},
    address:{type:String},
    phone:{type:String,required:true},
    verified:{type:Boolean,required:true},
    otp:{type:Number,required:true},
    salt:{type:String,required:true},
    otp_expiry:{type:Date,required:true},
    lat:{type:Number},
    lng:{type:Number},
    orders:[{
        type:Schema.Types.ObjectId,
        ref:"order"
    }],
    cart:[{
        food:{type:Schema.Types.ObjectId, required:true, ref:"food"},
        unit:{type:Number, required:true}
    }]

},{
    toJSON:{
        transform(doc,ret){
            delete ret.updatedAt
            delete ret.createdAt
            delete ret.password
            delete ret.salt
            delete ret.__v 
        }
        
    },
    
    timestamps:true
})

const Customer=mongoose.model<CustomerDoc>("customer",CustomerSchema)

export {Customer}