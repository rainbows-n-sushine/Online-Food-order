import mongoose,{Model, Document,Schema} from "mongoose"

export interface OfferDoc extends Document{
  offerType:string,//Vendor //Generic 
  vendors:[any],// ['576245348]
  title:string,//INR 200 of two weeks
  description:string,//any description with terms and conditions
  minValue:number,//minimum order amount should be 300
  offerAmount:number,//200
  startValidity:Date,
  endValidity:Date,
  promocode:string,//WEEK 200
  promotype:string,//USER//ALL//BANK //CARD
  bank:[any],
  bins:[any],
  pincode:string,
  isActive:boolean


  

}

const OfferSchema=new Schema({
    offerType:{type:String, required:true},
    vendors:[
        {type:Schema.Types.ObjectId,ref:"vendor"}
    ],
    title:{type:String, require:true},
    description:String,
    minValue:{type:Number, require:true},
    offerAmount:{type:Number, require:true},
    startValidity:Date,
    endValidity:Date,
    promocode:{type:String, required:true},
    promotype:{type:String, required:true},
    bank:[
        {type:String}
    ],
    bins:[
        {type:Number}
    ],
    pincode:{type:String, required:true},
    isActive:Boolean

},{
    toJSON:{
        transform(doc,ret:any){
            delete ret.__v

        },
        timestamps:true
    }
})

const Offer=mongoose.model<OfferDoc>("offer",OfferSchema)

export{Offer}





