const express=require("express");
const router=express.Router({mergeParams:true});


const listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const {isOwner, isReviewAuthor}=require("../middleware.js");



//review table
const Review=require("../models/review");

const reviewController=require("../controllers/review.js");



//validate review
const validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error){
        let errMsg=result.error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//reviews
//post index
router.post("/",validateReview,wrapAsync(reviewController.postReview)
);

router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.deleteReview
));

module.exports=router;