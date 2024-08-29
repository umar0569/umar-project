const listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");

const {listingSchema,reviewSchema}=require("../schema.js");

const fetch =  require('node-fetch');
//geocoding
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// mapToken=process.env.MAP_TOKEN;
// const baseClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index=async(req,res)=>{
    let lists=await listing.find({});
    res.render("listing/index.ejs",{lists});
}

module.exports.renderNewForm=async(req,res)=>{
    res.render("./listing/addData");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const user=await listing.findById(id).populate({path:"reviews",
        populate:{path:"author"}
    }).populate("owner");
    if(!user){
        req.flash("error","Listing is not Found");
        res.redirect("/");
    }
    else{
        
        res.render("listing/show.ejs",{user});

    }

}


// module.exports.createListing=async(req,res)=>{
//     console.log("it is entering into createListing which is in controllers/listing");
//     var latitude=0;
//     var longitude=0;
//     console.log("Entering into createListing  req!");

//     const address = req.body.listing.location;
//     const url2 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
//     await fetch(url2)
//     .then(response => response.json())
//     .then(data => {
//         if (data.length > 0) {
//         // console.log('Coordinates:', data[0].lat, data[0].lon);
        
        
//         } else {
//         console.log('No results found');
//         }
//         latitude=data[0].lat;
//         longitude=data[0].lon;
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });




//     let result=listingSchema.validate(req.body);
//     if(result.error){
//         throw new ExpressError(400,result.error);
//     }
//     let url=req.file.path;
//     let filename=req.file.filename;
    
//     let list=req.body.listing;
//     list.coOrd={
//         lat: latitude,
//         lon:longitude,
//     };
//     console.log("the new added coordinates are:");
//     console.log(list.coOrd);
//     const neww=new listing(list);
//     neww.owner=req.user._id;
//     neww.image={filename,url};
//     // neww.coOrd={
//     //     lat: 14.4493717,
//     //     lon:79.9873763,
//     // };

//     let savedNeww=await neww.save();
//     console.log("the saved listing is"+savedNeww);
//     req.flash("success","New Listing Created!");
//     res.redirect("listing");
// }


module.exports.createListing = async (req, res) => {
    console.log("it is entering into createListing which is in controllers/listing");

    let latitude = 0;
    let longitude = 0;
    console.log("Entering into createListing req!");

    const address = req.body.listing.location;
    const url2 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    try {
        const response = await fetch(url2);
        const data = await response.json();
        latitude = parseFloat(data[0].lat);
        longitude = parseFloat(data[0].lon);

        if (data.length > 0) {
            console.log('Coordinates:', data[0].lat, data[0].lon);
            latitude = parseFloat(data[0].lat);
            longitude = parseFloat(data[0].lon);
        } else {
            console.log('No results found');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // Validate request body
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }

    // Get image path and filename from request
    let url = req.file.path;
    let filename = req.file.filename;

    // Create new listing object
    let list = req.body.listing;
    list.coOrd = {
        lat: latitude,
        lon: longitude,
    };

    console.log("The new added coordinates are:");
    console.log(list.coOrd);

    const newListing = new listing(list);
    newListing.owner = req.user._id;
    newListing.image = { filename, url };

    // Save the new listing to the database
    let savedNewListing = await newListing.save();
    console.log("The saved listing is", savedNewListing);

    req.flash("success", "New Listing Created!");
    res.redirect("listing");
};



//this is edit form
module.exports.renderForm=async (req,res)=>{
    let {id}=req.params;
    const user=await listing.findById(id);
    if(!user){
        req.flash("error","Listing you requested doesn't exist");
        res.redirect("/");
    }
    else{
        let originalImg=user.image.url;
        originalImg=originalImg.replace("/upload","/upload/h_300,w_250");
        res.render("listing/edit.ejs",{id:user,imgLink:originalImg});
    }
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;

    let list=req.body.listing;
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        list.image={filename,url};
        
        

    }
    
    
    const updatedList=await listing.findByIdAndUpdate(id,list);
    console.log(updatedList);
    req.flash("success","Listing Updated Successfully!");
    res.redirect("/listing");
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let listt=await listing.findByIdAndDelete(id);
    console.log(listt);
    if(!listt){
        req.flash("error","The post you requested is not available!");
        res.redirect("/listing");
    }
    else{
        req.flash("success","The post deleted successfully!");
        res.redirect("/listing");
    }
}