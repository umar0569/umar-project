const listing=require("../models/listing");

const Review=require("../models/review");


module.exports.postReview=async(req,res)=>{

    let list=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    

    

    return res.redirect(`/listing/${list._id}`);
    
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId).then((result)=>{
        
    req.flash("success","review Deleted Successfully!");
    res.redirect(`/listing/${id}`);
    });
}