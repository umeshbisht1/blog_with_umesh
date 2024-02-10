import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.route("/add-new").get(async (req, res, next) => {
  return res.render("addblog", {
    user: req.user,
  });
});
router
  .route("/")
  .post(upload.single("coverImageUrl"), async (req, res, next) => {
    if (req.user) {
      const { title, body } = req.body;
      try {
        const blog = await Blog.create({
          title,
          body,
          createdBy: req.user._id,
          coverImageUrl: `/uploads/${req.file.filename}`,
        });
        return res.redirect("/");
      } catch (error) {
        
        return res.redirect("/add-new");
      }
    } else
      return res.render("signin", {
        error: "u are not a logged in user",
      });
  });
router.route("/:id").get(async (req, res, next) => {
  try {
    const blogs = await Blog.findById(req.params.id).populate("createdBy");
   const comment=await Comment.find({blogId:req.params.id}).populate("createdBy");
   
    return res.render("blog", {
      user: req.user,
      blog: blogs,
      comment
    });
  } catch (error) {
    
    return res.render("home", {
      error: "error in getting the blog details",
    });
  }
});
router.route("/comment/:_id").post(async(req,res,next)=>{
    
    try {
        const comment=await Comment.create({
            content:req.body.content,
            blogId:req.params._id,
            createdBy:req.user._id
        })
       
    } catch (error) {
       
        
    }
    return res.redirect(`/blog/${req.params._id}`)
})
export default router;
