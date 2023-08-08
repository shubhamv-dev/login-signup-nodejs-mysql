// index.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const sequelize = require('./db/database')
const UserModel = require('./models/user');
const app = express();
const PORT = process.env.PORT || 9000;
const SECRET_KEY = 'your-secret-key'; // Change this to a strong secret key in production!




// Test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Initialize the User model

const User = UserModel(sequelize);

app.use(express.json());

// Helper function to generate JWT token
function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, {
        expiresIn: '1h', // Token expires in 1 hour
    });
}

// Middleware to authenticate and check user role
function authenticateUser(roles) {
    return (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Token not found' });
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            if (roles && roles.length > 0 && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            req.user = decoded;
            next();
        });
    };
}

// Sign-up endpoint
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("req.body", req.body)
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        const token = generateToken(user);
        res.status(201).json({ user:user , token:token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sign-in endpoint
app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Received sign-in request for username:', username);

    const user = await User.findOne({
      where: { [Op.or]: [{ username }, { email: username }] },
    });

    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Sample protected route accessible to users with 'super admin' role
app.get('/api/super-admin', authenticateUser(['super admin']), (req, res) => {
    res.json({ message: 'You accessed the super admin route.' });
});

// Sample protected route accessible to users with 'manager' role
app.get('/api/manager', authenticateUser(['manager']), (req, res) => {
    res.json({ message: 'You accessed the manager route.' });
});

// Sample unprotected route
app.get('/api/public', (req, res) => {
    res.json({ message: 'This is a public route accessible to everyone.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

