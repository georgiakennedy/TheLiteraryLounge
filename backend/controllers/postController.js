const mongoose = require('mongoose');
const Post = require('../models/post.js');

exports.createPost = async (req, res) => {
  try {
    const author = req.user.userId;
    const { title, content, category } = req.body;
    const newPost = new Post({ title, content, category, author });
    await newPost.save();
    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const post = await Post.findById(id)
      .populate('author', 'username email profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email profilePicture');
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

exports.toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const index = post.likedBy.findIndex((uid) => uid.toString() === userId);
    let message;
    if (index === -1) {
      post.likedBy.push(userId);
      post.likes += 1;
      message = 'Post liked';
    } else {
      post.likedBy.splice(index, 1);
      post.likes -= 1;
      message = 'Post unliked';
    }
    await post.save();
    res.status(200).json({ message, post });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};
