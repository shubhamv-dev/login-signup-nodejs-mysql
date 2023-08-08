const { User } = require('../models/user'); // Assuming your Sequelize model is named User
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Signup Controller
async function signup(req, res) {
  const { username, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user record
    const newUser = await User.create({ username, email, password: hashedPassword, role });

    return res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to signup' });
  }
}

// Signin Controller
async function signin(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'your-secret-key', {
      expiresIn: '1h', // Token expiration time
    });

    return res.status(200).json({ message: 'Signin successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to signin' });
  }
}

module.exports = {
  signup,
  signin,
};
