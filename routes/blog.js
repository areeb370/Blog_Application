const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/Blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    coverImageURL: `uploads/${req.file.filename}`,
    title: title,
    body: body,
    createdBy: req.user.id,
  });
  res.redirect(`/blog/${blog._id}`);
});

router.post("/:id/comment", async (req, res) => {
  const { body } = req.body;
  await Comment.create({
    body: body,
    blog: req.params.id,
    createdBy: req.user.id,
  });
  res.redirect(`/blog/${req.params.id}`);
});

router.get("/add-new", async (req, res) => {
  res.render("addBlog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blog: blog._id }).populate("createdBy");
  res.render("blog", { user: req.user, blog, comments });
});

module.exports = router;
