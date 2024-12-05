const mongoose = require("mongoose");

// Define data schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true
  },
},
  {
    timestamps: true,
  }
);

// Export the model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
