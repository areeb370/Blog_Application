const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Blog = require("../models/Blog");
const { GenerateToken } = require("../services/authentication");

router.get("/", async (req, res) => {
  userBlogs = await Blog.find({ createdBy: req.user.id });
  res.render("home", { user: req.user, blogs: userBlogs });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.matchPassword(email, password);
    const token = GenerateToken(user);
    res.cookie("token", token).redirect("/user");
  } catch (err) {
    res.render("login", { error: "Invalid credentials" });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await User.create({
    fullName: fullName,
    email: email,
    password: password,
  });
  res.redirect("/user");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/user");
});

module.exports = router;
