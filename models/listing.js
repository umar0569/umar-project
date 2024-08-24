const mongoose=require("mongoose");
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    description:{
        type:String
    },
    image:{
        filename:String,
        url:String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    coOrd:{
        lat:Number,
        lon:Number,
    },
    // geometry:{
    //     type:String,
    //     enum:['point'],
        
    // },
    
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;
