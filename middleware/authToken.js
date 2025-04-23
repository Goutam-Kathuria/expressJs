const jwt = require('jsonwebtoken');
const User = require('../modals/User');


const verifyToken = async (req,res,next)=>{
const token = req.headers['authorization']?.split(' ')[1];

if(!token){
    return res.status(404).json({message:"A token is required for authorization"});
}

try {
   const decoded = jwt.verify(token,process.env.JWT_KEY)
const user = await User.findOne({email:decoded.email})
   req.user = user
   console.log("Succesful token");
   
   next() 
} catch (error) {
    console.error(error)
    return res.status(500).json({message:"Invalid Token"}); 
}

}
const roleChecker = (role)=>{

    return (req,res,next)=>{
try {
    if(req.user.role!==role){

        console.log(req.user,req.user.role,"role=",role);

        return res.status(404).json({message:"You ain't got the rights for this job. Go hustle elsewhere."})
    }
    console.log('sucess from role');
    
    next()   
} catch (error) {
    console.error(error,"error");
    return res.status(500).json({message:" Server Error"})
}
}
}
module.exports = {roleChecker,verifyToken}
