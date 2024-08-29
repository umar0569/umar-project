const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

console.log("Entering into cloudconfig.js");
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});
console.log("Exited from cloudconfig.js");
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'wanderlust_DEV',
        allowedFormats:["png","jpg","jpeg","avif"],
    },
});

module.exports={
    cloudinary,storage,
}

