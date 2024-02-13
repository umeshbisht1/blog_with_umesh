import mongoose from "mongoose";
import { Schema } from "mongoose";
const commentschema= new Schema({
    content:{
        type:String,
        required:true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:"Blog"
    },
    liked:{
        type:Number,
        default:0
    },
    disliked:{
        type:Number,
        default:0
    }
},{timestamps:true})
export const Comment =mongoose.model("Comment",commentschema)