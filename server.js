const express = require('express')
const connectDB = require('./database');
const cors = require('cors');
const sendMail = require('./config/nodemailerConfig');
const User = require('./modals/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {verifyToken,roleChecker} = require('./middleware/authToken');
const logger = require('./middleware/logger');
const Product = require('./modals/cofee')
const Courses = require('./modals/course');
const Cofee = require('./modals/cofee')
const errorHandler = require('./middleware/errorHandler');
const upload = require('./middleware/multer');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
    origin:"http//locakhost:3000",
    credentials:true
}))

app.use(express.json());
app.use(errorHandler)

const tempUser ={}

//ye line hame databse mai data parse(bhejne)mai help kregi
// database mai pehla user insert krna

//for hashing password we will user bcrypt password
// for matching a normal paswword with hashed password we will use bcrypt.comapare method.

//bcrypt.hash method
// we will need only 2 params if we have too hash any password.
// 1. password
// 2.saltRounds=a certified number at which a particular algorithm will be hitted. -> genSalt(10)
app.post("/register",logger,async (req,res)=>{
    try {
    const{name,email,password,contact,role}=req.body;
    const saltRounds= await bcrypt.genSalt(10);
    const hashedPassword =  await bcrypt.hash(password,saltRounds)
    console.log(hashedPassword);
    const result =await bcrypt.compare(password,hashedPassword)
    console.log('Value of matched password is',result);
    
    //for saving this data
    const otp = Math.floor(100000+Math.random()*900000).toString();
   //i can also use await User.create({data}) there then
    //this step which i use in code is for when i want to modify code before save like i want to forgot about contact in this method i can add there like newUser.contact = 98130....Good for modifying or manipulating data before saving.
    //  add like this but in my commented step 🔥 If you don’t need to modify data before saving, ALWAYS use Name.create() → Shorter & cleaner. 💥

    tempUser[email]  =  {name,email,password:hashedPassword,contact,role,otp};
     // i dont this line if i use upper thing
    const subject ='hlo bitiya rani🔥🔥🔥🔥 Your OTP for verification'
    const text = `Hi ${name} , thank you for registering at our platform . your otp is ${otp} is this dont share pls for your good`
const html=`
<h2> thank you for register</h2>
<p style="color:red">your ${otp} is : <strong>${otp}</strong></P>`

sendMail(email,subject,text,html)
    console.log("OTP Send Sucessfully");
    console.log("Register Data =>",tempUser[email]);
    
    return res.status(200).json({message:"Jai Mahakaal"})
    } catch (error) {
        console.error('error',error)
        return res.status(500).json({message:"Server Error"})
    }
})

// database se data extract krne ke liye ham log get method use krege
app.post('/add',verifyToken,roleChecker('Counceler'),upload.single("banner"),async(req,res)=>{
   try {
    const {title,Course_Duration,Trainer,Description,category,discountPercentage,offerTillDate,startDate,endDate,createdBy}=req.body
const banner = req.file.path

    const newData = new Courses({title,Course_Duration,Trainer,Description,category,discountPercentage,offerTillDate,startDate,endDate,banner,createdBy})
    await newData.save()
console.log(newData);
return res.status(200).json({message:"Cource Added "})
   } catch (error) {
    console.error(error);
    return res.status(500).json({message:"Server error"})
   }
  
})
 app.get('/alluser',logger,verifyToken,roleChecker("Student"), async(req,res)=>{
    try {
        const users=await User.find();
        res.json(users);
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Server Error"})
    }
 })
 app.get('/allcourse', async(req,res)=>{
    try {
        const {search,duration,category}=req.query;
        let filters={}
        if(search){
        filters.title={$regex:search,$options:"i"}  // i is for ignore
        }
         if(duration){
         filters.duration={$regex:duration,$options:"i"};
     }
     if(category){
        filters.category={$regex:category,$options:"i"};
        }
       const courses = await Courses.find(filters);
       res.json(courses);
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Server Error"})
    }
 })
app.put('/users/:id',logger,async(req,res)=>{
    try {
        // findbyid
        const id = req.params.id
        const{name,email,password,contact}=req.body;
        const updateUser = await User.findByIdAndUpdate(id,{name,email,password,contact},{new:true});
        if(!updateUser){
            return res.status(404).json({message:"User Not found"})
        }
        res.json(updateUser)
        // jab postman ki req se koi data uthayege to ham req.params.data(id)ye use krege
    } catch (error) {
        return res.status(500).json({message:"Error"});
    }
})
 app.delete('/delete/:id',logger,async(req,res)=>{
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id)
        if(!deleteUser){
            return res.status(404).json({message:"User Not found"})
        }
        res.json(deleteUser);
    } catch (error) {
        return res.status(500).json({message:"Error"});
    }
 
 })
 app.post('/login',logger,async(req,res,next)=>{
    try {
        const {email,password}=req.body
        const user =await User.findOne({email})
        if(!user){
            return res.status(403).json({message:"User not found"})
        }
   const result = await bcrypt.compare(password,user.password); // it return boolean value

//    if(!result){
//    return res.status(404).json({message:"password not match"})
//    }

   const token = jwt.sign({email},process.env.JWT_KEY,{expiresIn:'1h'});

    return res.status(200).json({message:"succesful",token})
    } catch (error) {
     next(error)
    }
 })
 app.post('/otp',logger,async(req,res)=>{
    try {
        const{email,otp}=req.body;
        console.log("Register Data in otp=>",tempUser[email]);
        if(tempUser[email].otp !== otp){
            return res.status(400).json({messgae:"otp is not valid"})
        }
        console.log("OTP'S =>",tempUser[email].otp,otp);
        const newUser=new User({name:tempUser[email].name,email:tempUser[email].email,password:tempUser[email].password, contact:tempUser[email].contact, role:tempUser[email].role}); 
          await newUser.save(); 
        console.log("After All =>",tempUser[email]);
delete tempUser[email]

        return res.status(200).json({messgae:"otp is valid"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({messgae:"Unwanted Error"})
    }
   
 })

 app.patch('/edit',async(req,res)=>{
    try {
    const {search} = req.query

    let filters={}
    if(search){
    filters.title={$regex:search,$options:"i"}  // i is for ignore
    }

    const {title,Course_Duration,Trainer,Description,category,discountPercentage,offerTillDate,startDate,endDate,banner,createdBy}=req.body

const updateCourse = await Courses.findOneAndUpdate(filters,{$set:{title,Course_Duration,Trainer,Description,category,discountPercentage,offerTillDate,startDate,endDate,banner,createdBy}},{new:true});

res.json(updateCourse)
console.log(updateCourse);

} catch (error) {
    console.error(error)
    return res.status(500).json({messgae:"Unwanted Error"})
}


 })
 app.get('/alluser1', async(req,res)=>{
    try {
        const users=await User.find();
        res.json(users);
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Server Error"})
    }
 })
 
app.post('/starbuck',upload.single('image'),async(req,res)=>{
    try {
    const {name,type,calories,price}=req.body
    const image = req.file.path
    const newCofee = new Product({name,type,image,calories,price})
    await newCofee.save()
    return res.status(200).json({message:'Done'})
} catch (error) {
    console.error(error);
    
    return res.status(500).json({message:'Server Error'})       
}
})
app.get('/cofee',async (req,res,next) => {
    try {
    const {type}=req.query
    const filter = {}
    if(type){
        filter.type = {$regex:type,$options:"i"}
    }
    const cofee =await Cofee.find(filter)
    res.json(cofee)
} catch (error) {
        next(error)
}
})

app.listen(5000,()=> console.log('server is running localhost:5000'));

//http://Localhost:5000/api/ganja
