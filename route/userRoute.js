const express=require('express')
const authController=require('../controller/authController');

const router=express.Router();

router.post('/register',authController.register)
router.post('/sendCode', authController.forgotPassword);
router.post('/login',authController.logIn)
router.patch('/reset',authController.protect,authController.resetPassword)
router.post('/verify',authController.verifyOTP)


//for Admins only 
router.get ('/all'
,authController.restrictTo
,authController.getAllUsers)
module.exports=router;
