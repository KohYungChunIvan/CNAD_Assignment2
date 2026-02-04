import User from "../models/User.js";

// Controller function to retrieve all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // Respond with the list of users
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to retrieve a specific user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllUsers,
  getUserById
};