const Comment = require('../models/comment.js');

exports.createComment = async (req, res) => {
  try {
    const { content, author, post } = req.body;
    const newComment = new Comment({ content, author, post });
    await newComment.save();
    res.status(201).json({ message: 'Comment created', comment: newComment });
  } catch (error) {
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
