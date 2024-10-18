const User = require('../models/User');

// Get all users with pagination
const getUsers = async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  
  const count = await User.countDocuments({});
  const users = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, phone, status } = req.body;

  const user = new User({
    name,
    email,
    phone,
    status,
  });

  const createdUser = await user.save();
  res.status(201).json(createdUser);
};

// Update a user by ID
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.status = req.body.status !== undefined ? req.body.status : user.status;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
