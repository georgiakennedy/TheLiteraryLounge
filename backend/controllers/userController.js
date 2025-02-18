const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message =
        field === 'username'
          ? 'Username already taken'
          : field === 'email'
          ? 'Email already in use'
          : 'Duplicate field error';
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
