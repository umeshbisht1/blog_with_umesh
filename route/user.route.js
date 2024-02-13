import express from "express";
import { signin, signup } from "../controller/user.controller.js";
import { User } from "../models/user.model.js";
import { createtoken } from "../services/authication.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
const router = express.Router();
//signin
router
  .route("/signin")
  .get(signin)
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return res.res.render("signin", {
          error: "Incorrect email and password",
        });
      }
      const check = await user.isCorrect(password);

      if (!check) {
        return res.res.render("signin", {
          error: "Incorrect email and password",
        });
      }
      const token = createtoken(user);

      return res.cookie("token", token).redirect("/");
    } catch (error) {
      return res.render("signin", {
        error: "Incorrect email and password",
      });
    }
  });
//signup
router.route("/signup").get(signup);
router.route("/signup").post(async (req, res, next) => {
  const { firstName, email, password } = req.body;
  try {
    const user = await User.create({
      firstName,
      email,
      password,
      profileImageUrl: "/images/images.jpg",
    });

    return res.redirect("signin");
  } catch (error) {}
});
//logout
router.route("/logout").get(async (req, res, next) => {
  res.clearCookie("token").redirect("/");
});
//userprofile
router.route("/getuserprofile").get(async (req, res, next) => {
  if (!req.user)
    return res.render("signin", {
      error: "u are not logged in ",
    });
  try {
    const user = await User.findById(req.user._id);
    const blog = await Blog.find({ createdBy: req.user._id });
    return res.render("profile", {
      user,
      blog,
    });
  } catch (error) {
    return res.redirect("/");
  }
});
router.route("/delete").get(async (req, res, next) => {
  try {
    await Comment.deleteMany({ createdBy: req.user._id });
    await Blog.deleteMany({ createdBy: req.user._id });
    await User.deleteOne({ _id: req.user._id });

    return res.clearCookie("token").redirect("/");
  } catch (error) {
    console.log(error.message);
    return res.render("home", {
      error: "error occured in deleting the user",
    });
  }
});
export default router;
