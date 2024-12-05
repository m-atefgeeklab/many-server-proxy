const mongoose = require("mongoose");

// Define data schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
},
  {
    timestamps: true,
  }
);

// Export the model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
