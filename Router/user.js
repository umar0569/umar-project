const express=require("express");
const router=express.Router();


const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");

const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/user.js");

//get request for signup
router.get("/signup",wrapAsync(userController.signup)
);

//post request for signup
router.post("/signup",wrapAsync(userController.postSignup));


//get req for login
router.get("/login",wrapAsync(userController.getLogin));

//post req for login
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(userController.postLogin));

router.get("/logout",wrapAsync(userController.userLogout));



module.exports=router;

//working on user index function


