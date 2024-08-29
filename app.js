const express=require("express");
const app=express();
const mongoose=require("mongoose");

const initData=require("./init/data");


const listing=require("./models/listing.js");
const review=require("./models/review");




if(process.env.NODE_ENV != "Production"){
    require("dotenv").config();

}

//passport
const passport=require("passport");
const localStrategy=require("passport-local");
const User2=require("./models/user.js");


//session
const session=require("express-session");
const MongoStore=require("connect-mongo");




//flash
const flash=require("connect-flash");


//utility
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");



//server side validation
const {listingSchema,reviewSchema}=require("./schema.js");


//routing listings
const listingsRouter=require("./Router/listingss.js");


//reviews
const reviewsRouter=require("./Router/review.js");


//user
const UsersRouter=require("./Router/user.js");



const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const {clear} = require("console");
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET_CODE,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("Error in mongo store",err);
});
const sessionValues={
    store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionValues));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User2.authenticate()));

passport.serializeUser(User2.serializeUser());
passport.deserializeUser(User2.deserializeUser());


//flash middleware
app.use(async(req,res,next)=>{
    console.log(res.locals.success);
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    console.log(res.locals.success);
    console.log("the req.user is :"+req.user);
    console.log("the currUser is :"+res.locals.currUser);
    next();
});

const mongoUrl="mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLASDB_URL;
main().then((result)=>{
    console.log("connected to the database successfully!");

}).catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(dbUrl);
}



let port="7001";
app.listen(port,(req,res)=>{
    console.log(`app is listening on ${port}`);
});

// home page
app.get("/",wrapAsync(async (req,res)=>{
    let lists=await listing.find({});
    res.render("listing/index.ejs",{lists});
})
);


app.post("/search",async(req,res)=>{
    let {searchBox}=req.body;
    let lists=await listing.find({country:searchBox});
    console.log(lists);

    res.render("listing/index.ejs",{lists});
});
app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",UsersRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!please try later!"}=err;
    res.status(statusCode).render("error.ejs",{key:err.message});
});



