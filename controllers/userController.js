const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

// POST /api/register
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both the fields!");
  }

  //   Find if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({ email, password: hashedPassword });

  // if user created
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      password: user.password,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// POST /api/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req?.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide the email field.");
  } else if (!password) {
    res.status(400);
    throw new Error("Please provide the password field.");
  }

  const user = await User.findOne({ email });

  // Check user and password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

module.exports = { registerUser, loginUser };
