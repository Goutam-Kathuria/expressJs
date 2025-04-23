const mongoose = require('mongoose')
require('dotenv').config();
const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
       useNewUrlParser:true,
        useUnifiedTopology:true,
        })
        console.log('🔥 MongoDB connected successfully!');
        
    } catch (error) {
        console.log(error);
        console.log('❌ Error');
    }
}
module.exports=connectDB;