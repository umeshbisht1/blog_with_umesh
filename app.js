import express from "express";
import path from "path";
import userrouter from "./route/user.route.js";
import blogrouter from "./route/blog.router.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { checkforcookie } from "./middleware/authicationuser.js";
import { Blog } from "./models/blog.model.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());
app.use(express.json());
app.use(checkforcookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

await mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((error) => {
    console.log("error in connection");
    return;
  });
// file system
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get("/", async (req, res) => {
  const blogs = await Blog.find();
  res.render("home", {
    user: req.user,
    blog: blogs,
  });
});
app.use("/user", userrouter);
app.use("/blog", blogrouter);
app.listen(PORT || process.env.PORT, () => {
  console.log(`port listhening at ${PORT}`);
});
