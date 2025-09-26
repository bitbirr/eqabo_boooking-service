import { createUser, findUserByEmail } from '../models/userModel.js';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Implement password verification and JWT token generation here
    res.status(200).json({ message: 'User logged in', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};