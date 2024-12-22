import mongoose,{Model,Schema,Document} from "mongoose"

export interface CustomerDoc extends Document{

    email:string
    password:string
    salt:string
    firstName:string
    lastName:string
    adress:string
    phone:string
    verified:boolean
    otp:number
    otp_expiry:Date
    lat:number
    lng:number
}

const CustomerSchema=new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    firstName:{type:String},
    lastName:{type:String},
    adress:{type:String},
    phone:{type:String,required:true},
    verified:{type:Boolean,required:true},
    otp:{type:Number,required:true},
    salt:{type:String,required:true},
    otp_expiry:{type:Date,required:true},
    lat:{type:Number},
    lng:{type:Number},

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