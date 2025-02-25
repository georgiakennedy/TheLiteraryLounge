const mongoose = require('mongoose');
const Post = require('../models/post.js');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    const newPost = new Post({ title, content, category, author });
    await newPost.save();
    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, category, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post updated', post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Posts not found' });
      }
      
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) return res.status(404).json({ message: 'Posts not found' });
      res.status(200).json({ message: 'Post deleted', post: deletedPost });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
  };

exports.likePost = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.status(200).json({ message: 'Post liked', post: updatedPost });
    } catch (error) {
      res.status(500).json({ message: 'Error liking post', error: error.message });
    }
  };
  
  exports.unlikePost = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      if (post.likes <= 0) {
        return res.status(400).json({ message: 'Post has no likes to remove' });
      }
      
      post.likes -= 1;
      await post.save();
      
      res.status(200).json({ message: 'Post unliked', post });
    } catch (error) {
      res.status(500).json({ message: 'Error unliking post', error: error.message });
    }
  };