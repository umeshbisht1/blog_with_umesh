import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const blogschema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
       required:true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    views:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);
export const Blog = model("Blog", blogschema);
