const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
require("dotenv").config();
const mongoose = require("mongoose");
const CheckAuthentication = require("./middlewares/authentication");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(CheckAuthentication);
app.use(express.static(path.resolve("./public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
