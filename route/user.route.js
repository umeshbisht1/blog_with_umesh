import express from 'express'
import { signin,signup } from '../controller/user.controller.js';
import { User } from '../models/user.model.js';
import { createtoken } from '../services/authication.js';
const router=express.Router();
router.route("/signin").get(signin).post(async(req,res,next)=>{
    const {email,password}=req.body;
    try {
         const user=await  User.findOne({
           email
           
         })
         if(!user)
         {
           
           return res.res.render("signin",{
            error:"Incorrect email and password"
           })
         }
         const check=await user.isCorrect(password);
        
         if(!check)
         {
            
            return res.res.render("signin",{
                error:"Incorrect email and password"
               })
         }
         const token=createtoken(user);
         
         return res.cookie('token',token).redirect("/");
    } catch (error) {
       
       return res.render("signin",{
        error:"Incorrect email and password"
       })
    }
     
})
router.route("/signup").get(signup)
router.route("/signup").post(async(req,res,next)=>{
    const {firstName,email,password}=req.body;
    try {
         const user=await  User.create({
            firstName,
            email,
            password,
            profileImageUrl:'/images/images.jpg'
         })
         
         return res.redirect("signin");
    } catch (error) {
        

    }
     
})
router.route("/logout").get(async(req,res,next)=>{
    res.clearCookie('token').redirect('/')
})
export default router;