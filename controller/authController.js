const jwt  = require('jsonwebtoken');
const User=require('../model/userModel');
const {promisify} =require ('util')
const crypto =require('crypto');

const {sendToEmail } = require('../utilities/OTP/Email.js');



exports.register=async (req,res)=>{
    try{
    const user = await User.create(req.body)
 
        res.status(201).json({
            status:true,
            message:"Sign up Successfully",
            
        })
    }
    catch(err){
        res.status(401).json({
            status:false,
            error:err ,
            
        })
    }
}


exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        //
            if (!user || !await user.correctPassword(password, user.password)) {
                return res.status(401).json ({
                    status:false,
                    message :"Invaled email or password"
                })
            } 
            //token 
            //using jsonWebToken 
            // used to create authrization for each user 
            //each user can only add to his card only 

            
            let token = jwt.sign({ userId: user._id }, 'E-commerce App# first App',{expiresIn:"90d"});  
                      //add token for user by his id    //secret key               //valid time



            res.status(200).json({
                status: true,
                message: "Log in Successfully",
                token: token,
            });
        
    
    } catch (err) {
        res.status(401).json({
            status: false,
            error: err.message,
        });
        console.log(err);
    }
};


exports.protect= async(req,res,next) =>{
//token from user 
let token ;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
    token=req.headers.authorization.split(" ")[1]
}
console.log(token)
if(!token){
    return res.status(404).json({status :false ,message :"please log in"})
}


//verfiy token with secret key
const decodedToken = await promisify (jwt.verify)(token,'E-commerce App# first App') //return id
console.log(decodedToken)
//check user (of token) is exist
const currentUser =await User.findById(decodedToken.userId)


  if(!currentUser){
    return res.status(404).json({
        message : "Sesstion is expired"
    })
  }


  req.user=currentUser
next()
}

exports.restrictTo=()=>{ 
    //Guard 
    return (req,res,next)=>{
        if(!req.user.isAdmin){
            return res.status(403).json({
                status:false,
                message:"you don't have licence to do this action"
            })
        }
        next();
    }

}

exports.forgotPassword =async(req, res)=> {
    try{
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return res.status(404).json({
            status:false,
            message:"Account 't found"
        })
    }

    const otp = await user.generateOtp()
    await user.save({ validateBeforeSave: false });
    sendToEmail(req.body.email,otp)

    res.status(200).json({
        status:true,
        meesage:"otp generated and send to your email"
    })
}catch(err){
    res.status(401).json({
        status:false,
        err
    })
}
}

exports.verifyOTP=async(req,res)=>{
    try{
        const otp=crypto.createHash('sha256').update(req.body.otp).digest('hex');;
        const user = await User.findOne({otp:otp,otpExpires:{ $gt: Date.now() },})
        if(!user){
            return res.status(401).json({
                status:false,
                message:"Otp is n't valid"
            })
        }
        const token = jwt.sign({ userId: user._id }, 'E-commerce App# first App',{expiresIn:"90d"});  
        res.status(200).json({
            status:true,
            messge:"Comfirmed OTP",
            token
        })
    }  
    catch(err){

    }
}

exports.resetPassword = async (req, res) => {

    try {
      const user =req.user;
      user.password=req.body.password
      user.confirmPassword=req.body.confirmPassword
      user.otp=undefined,
      user.otpExpires=undefined
      user.save({validateBeforeSave:true})
      res.status(200).json({
        status:true,
        user
      })
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllUsers = async (req,res)=>{
    try{
   const users = await User.findOne()
   if(!users){
    res.status(404).json ({
        msg :"Users not found" ,
        err:err 
    })
   } else{
   res.status(200).json ({
    users :users ,
})
   }
    }
    catch (err){
        res.status(500).json ({
            msg :"Internal server error" ,
            error : err
        })
    }
}