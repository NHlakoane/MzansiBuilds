const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

// REGISTER - Create a new account
const registerUser = async (req, res) => {
  try {
    const { username, email, password, full_name, bio } = req.body;

    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
   

    // Check if email already exists
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if username already exists
    const usernameExists = await User.findByUsername(username);
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Scramble the password
    const password_hash = await hashPassword(password);

    // Create the user in database
    const user = await User.create({
      username,
      email,
      password_hash,
      full_name,
      bio
    });

    // Send back user info + token
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN - Sign into existing account
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Add validation for login too
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send back user info + token
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET PROFILE - Get currently logged in user's info
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe };