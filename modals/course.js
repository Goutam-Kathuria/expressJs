const slugify = require('slugify');
const mongoose = require('mongoose')

// the method which is used to create schema is known as schema method

const userSchema = new mongoose.Schema({
    title:{type:String,required:true},
    Course_Duration:{type:String,required:true},
    Trainer:{type:String,required:true},
    Description:{type:String,required:false},
    category:String,
    discountPercentage:String,
    offerTillDate:String,
    startDate:String,
    endDate:String,
    isFeatured:Boolean,
    banner:String,
    createdBy:String
    // otp:{type:String,required:false},
},{timestamps:true});
userSchema.pre('save',function(next){
    if(!this.slug){
        this.slug=slugify(this.title);
    }
    next()
})
const Courses = mongoose.model('Course',userSchema)
module.exports=Courses;