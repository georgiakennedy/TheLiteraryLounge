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
