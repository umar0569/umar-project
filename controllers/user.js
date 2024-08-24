
const User=require("../models/user.js");


module.exports.signup=async(req,res)=>{
    res.render("users/signup");
}

module.exports.postSignup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;

        const user1=new User({
            username,
            email
        });
        const registeredUser=await User.register(user1,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listing");

        })
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/listing");
    }

}

module.exports.postLogin=async(req,res)=>{
    
    req.flash("success","Welcome back to wanderLust!");
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    else{
        return res.redirect("/listing");
    }
}

module.exports.userLogout=async(req,res,next)=>{
    req.logout(
        (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","you are logged out successfully!");
            res.redirect("/listing");
        }
    );
}

module.exports.getLogin=async(req,res)=>{
    res.render("users/login.ejs");
}