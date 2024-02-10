import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userschema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    
    profileImageUrl:{
        type:String,
        default:"/images/images.png",

    },
    role:{
        type:String,
        enum:['USER',"ADMIN"],
        default:"USER"
    }
},{timestamps:true});
userschema.pre("save",async function(next){

    if(this.isModified("password")){
      
   this.password=bcrypt.hashSync(this.password,10) 
    // it takes towo thing passward and saltround to encrypt
    
    }
    next();
})
userschema.methods.isCorrect = async function(password)
{
   return await bcrypt.compare(password,this.password)
}
export const User=mongoose.model("User",userschema)