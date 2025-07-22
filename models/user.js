const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { error } = require("console");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPass = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPass;

  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const salt = user.salt;
  const hashedPass = createHmac("sha256", salt).update(password).digest("hex");
  if (hashedPass !== user.password) {
    throw new Error("Incorrect Password");
  }
  user.password = undefined;
  user.salt = undefined;
  return user;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
