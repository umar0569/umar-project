const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

console.log("Entering into cloudconfig.js");
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME2,
    api_key:process.env.CLOUD_API_KEY2,
    api_secret:process.env.CLOUD_API_SECRET2
});
console.log("Exited from cloudconfig.js");
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'wanderlust_DEV',
        allowedFormats:["png","jpg","jpeg"],
    },
});

module.exports={
    cloudinary,storage,
}

