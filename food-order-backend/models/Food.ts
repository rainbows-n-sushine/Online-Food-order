import mongoose,{Model, Document,Schema} from "mongoose"

export interface foodDoc extends Document{
    vendorId:string,
    name:string,
    description:string,
    category:string,
    foodType:[string],
    readyTime:number,
    price:number,
    rating:number,
    images:[string],
  

}

const FoodSchema=new Schema({
    vendorId:{type:String},
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:String},
    foodType:{type:[String],required:true},
    readyTime:{type:Number},
    rating:{type:String},
    images:{type:[String]}

},{
    toJSON:{
        transform(doc:foodDoc,ret:any){
            delete ret.createdAt,
            delete ret.updatedAt,
            delete ret.__v

        },
        timestamps:true
    }
})

const Food=mongoose.model<foodDoc>("food",FoodSchema)

export{Food}





