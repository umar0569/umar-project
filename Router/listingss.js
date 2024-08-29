const express=require("express");
const app=express();
const router=express.Router();

//utility
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const {listingSchema,reviewSchema}=require("../schema.js");

const listing=require("../models/listing.js");

const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//midddleware
const {validateListing,isLogin,isOwner}=require("../middleware.js");

app.use(express.urlencoded({extended:true}));

//controller folder
const listingController=require("../controllers/listings.js");



router.route("/")
//index route
.get(wrapAsync(listingController.index))
//create new listing route
//this is the format
// isLogin,upload.single("listing[image][url]"),validateListing,
// wrapAsync(listingController.createListing)
.post(isLogin,upload.single("listing[image][url]"),validateListing,
    wrapAsync(listingController.createListing));
// .post(upload.single("listing[image][url]"),(req,res)=>{
//     res.send(req.file);
// });
// validateListing

//create new route
router.get("/New",isLogin,wrapAsync(listingController.renderNewForm)
);

router.route("/:id")
//show route
.get(isLogin,wrapAsync(listingController.showListing)
)
//put data route(Update)
// 
.put(isLogin,isOwner,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.updateListing)
);
// validateListing,




//show route
// router.get("/:id",isLogin,wrapAsync(listingController.showListing)
// );

//post new route(create)
// router.post("/",isLogin,validateListing,
//     wrapAsync(listingController.createListing)
// );
//edit data route
router.get("/:id/edit",isLogin,isOwner,wrapAsync(listingController.renderForm)
);

//put data route(Update)
// router.put("/:id",isLogin,isOwner,validateListing,wrapAsync(listingController.updateListing)
// );


router.delete("/:id/delete",isLogin,isOwner,wrapAsync(listingController.deleteListing)
);
router.post("/search",async(req,res)=>{
    let {searchBox}=req.body;
    let lists=await listing.find({country:searchBox});
    console.log(lists);

    res.render("listing/index.ejs",{lists});
});

module.exports=router;