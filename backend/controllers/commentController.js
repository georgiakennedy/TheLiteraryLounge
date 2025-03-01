const mongoose = require('mongoose');
const Comment = require('../models/comment.js');
const Post = require('../models/post.js');

exports.createComment = async (req, res) => {
  try {
    const author = req.user.userId; 
    const { content, post } = req.body;
    const newComment = new Comment({ content, post, author });
    await newComment.save();
    
    await Post.findByIdAndUpdate(post, { $push: { comments: newComment._id } });
    
    res.status(201).json({ message: 'Comment created', comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'username')
      .populate('post', 'title');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );
    if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json({ message: 'Comment updated', comment: updatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) return res.status(404).json({ message: 'Comment not found' });
    await Post.findByIdAndUpdate(
      deletedComment.post,
      { $pull: { comments: deletedComment._id } },
      { new: true }
    );
    res.status(200).json({ message: 'Comment deleted', comment: deletedComment });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
