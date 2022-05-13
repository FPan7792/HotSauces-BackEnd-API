const mongoose = require("mongoose");
const mongooseUnique = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(mongooseUnique);

const User = mongoose.model("User", userSchema);

module.exports = User;
