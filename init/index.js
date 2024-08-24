const mongoose=require("mongoose");
const listing=require("../models/listing");
const initData=require("./data");

const dbUrl=process.env.ATLASDB_URL;
main().then((result)=>{
    console.log("connected to the database successfully!");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true });
}
async function init(){
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66bb8dc9507038fd10ea5378"}));
    await listing.insertMany(initData.data).then((result)=>{
        console.log(result);
        console.log("data was inserted!");
    });
}
init();