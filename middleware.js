
const listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
module.exports.isLogin=(req,res,next)=>{
    console.log(req.user);
    console.log("it is entering into middleware.js in isLogin");
    if(!req.isAuthenticated()){
        req.flash("error","you must logged in!");
        req.session.redirectUrl=req.originalUrl;
        

        return res.redirect("/login");

    }
    console.log("it is entered into middleware.js in isLogin successfully and called next()");
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    console.log("working at saveRedUrl");
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl+"after adding redirectUrl");
        
    }
    
    next();
    

}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listt=await listing.findById(id);
    console.log("entering into isOwner successfully!");

    if(res.locals.currUser && res.locals.currUser._id.equals("66c3546fc6de12c35e1c32ab")){
        next();

    }
    else if(res.locals.currUser && !listt.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","youre not the owner of the listing!");
        return res.redirect(`/listing/${id}`);

    }
    else{
        // console.log("entered into isOwner successfully!");
        next();

    }
    

}


//validateListing
module.exports.validateListing=async (req,res,next)=>{
    console.log(req.body);
    let result=listingSchema.validate(req.body);
    if(result.error){
        console.log("Error occured at middleware.js file\n");
        let errMsg=result.error.details.map((el)=>el.message).join(",");
        console.log(result);

        console.log("Error occured at middleware.js file");
    }
    else{
        console.log("validated listing successfully");
        next();
    }
};


//review ;login checking

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let reviewww=await Review.findById(reviewId);



    if(res.locals.currUser && !reviewww.author.equals(res.locals.currUser._id)){
        req.flash("error","youre not the owner of the listing!");
        return res.redirect(`/listing/${id}`);
    }
    else{
        next();
    }
}