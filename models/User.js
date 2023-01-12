import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please Provide Name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    validator: validator.isEmail,
    required: [true, "please Provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please Provide a valid password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  const user = this;
  // console.log(user.modifiedPaths());
  if (!user.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  return isMatch;
};

export default mongoose.model("User", userSchema);
