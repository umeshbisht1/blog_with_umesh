import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { cloudinaryupdate } from "../utils/uploadcloudniary.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
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
      if (req.file && req.file.path) {
        const coverImageUrl = await cloudinaryupdate(req.file.path);
        //if the file is sucesfully uploaded:
        if (coverImageUrl) {
          const { title, body } = req.body;
          try {
            const blog = await Blog.create({
              title,
              body,
              createdBy: req.user._id,
              coverImageUrl:coverImageUrl.url
            });
            return res.redirect("/");
          } catch (error) {
            return res.redirect("/blog/add-new");
          }
        }
        // if error:
        else{
          return res.render("addblog", {
            error: "error occured in uploading the image",
          });
        }
        
      }
      // if path is not availble
      else{
        return res.render("addblog", {
          error: "error occured in uploading the image",
        });
      }
    } else // this is because of user i s not logged in 
      return res.render("signin", {
        error: "u are not a logged in user",
      });
  });
router.route("/:id").get(async (req, res, next) => {
  try {
    const blogs = await Blog.findById(req.params.id).populate("createdBy");
    blogs.views+=1;
    await blogs.save({validateBeforeSave:false})
    const comment = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

    return res.render("blog", {
      user: req.user,
      blog: blogs,
      comment,
    });
  } catch (error) {
    return res.render("home", {
      error: "error in getting the blog details",
    });
  }
});
router.route("/comment/:_id").post(async (req, res, next) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      blogId: req.params._id,
      createdBy: req.user._id,
    });
  } catch (error) {}
  return res.redirect(`/blog/${req.params._id}`);
});
//for liking comment
router.route("/like/:id/:userid/:blogid").get(async(req,res,next)=>{
  const comment = await Comment.findById(req.params.id);
  //console.log(comment);
  
  const userId = req.params.userid;
  
  // Check if the user has already liked the comment
  const alreadyLiked = comment.liked.includes(userId);
  
  // Check if the user has disliked the comment earlier
  const alreadyDisliked = comment.disliked.includes(userId);
  
  // If the user has already liked, do nothing
  if (alreadyLiked) {
    return res.redirect(`/blog/${req.params.blogid}`)
  }
  
  // If the user has disliked earlier, remove from disliked and push to liked
  if (alreadyDisliked) {
    comment.disliked.pull(userId);
    comment.liked.push(userId);
  } else {
    // If the user has not liked or disliked, push to liked
    comment.liked.push(userId);
  }
  
  // Now save the updated comment
  try {
    await comment.save({validateBeforeSave:false});
  
    // Handle success, send response, etc.
    return res.redirect(`/blog/${req.params.blogid}`)
    
  } catch (error) {
    // Handle the error, send an error response, log, etc.
    console.error("Error updating like status:", error.message);
    return res.redirect("/");
  }
})
router.route("/dislike/:id/:userid/:blogid").get(async(req,res,next)=>{
  const comment = await Comment.findById(req.params.id);
  //console.log(comment);
  
  const userId = req.params.userid;
  
  // Check if the user has already disliked the comment
  const alreadydisLiked = comment.disliked.includes(userId);
  
  // Check if the user has liked the comment earlier
  const alreadyliked = comment.liked.includes(userId);
  
  // If the user has already liked, do nothing
  if (alreadydisLiked) {
    return res.redirect(`/blog/${req.params.blogid}`)
  }
  
  // If the user has disliked earlier, remove from disliked and push to liked
  if (alreadyliked) {
    comment.liked.pull(userId);
    comment.disliked.push(userId);
  } else {
    // If the user has not liked or disliked, push to liked
    comment.disliked.push(userId);
  }
  
  // Now save the updated comment
  try {
    await comment.save({validateBeforeSave:false});
  
    // Handle success, send response, etc.
    return res.redirect(`/blog/${req.params.blogid}`)
    
  } catch (error) {
    // Handle the error, send an error response, log, etc.
    console.error("Error updating like status:", error.message);
    return res.redirect("/");
  }
})
export default router;
