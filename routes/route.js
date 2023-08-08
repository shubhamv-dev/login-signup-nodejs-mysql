const express = require('express');
const { authenticate, authorizeRoles } = require('../helpers/auth');
const router = express.Router();

// Super admin route - protected with authentication and authorization
router.get('/super-admin', authenticate, authorizeRoles(['super admin']), (req, res) => {
  return res.status(200).json({ message: 'Welcome, Super Admin!' });
});

// Manager route - protected with authentication and authorization
router.get('/manager', authenticate, authorizeRoles(['super admin', 'manager']), (req, res) => {
  return res.status(200).json({ message: 'Welcome, Manager!' });
});

// Sales team route - protected with authentication and authorization
router.get('/sales-team', authenticate, authorizeRoles(['super admin', 'manager', 'sales team']), (req, res) => {
  return res.status(200).json({ message: 'Welcome, Sales Team!' });
});

// Customer support route - protected with authentication and authorization
router.get('/customer-support', authenticate, authorizeRoles(['super admin', 'customer support']), (req, res) => {
  return res.status(200).json({ message: 'Welcome, Customer Support!' });
});

// Content team route - protected with authentication and authorization
router.get('/content-team', authenticate, authorizeRoles(['super admin', 'content team']), (req, res) => {
  return res.status(200).json({ message: 'Welcome, Content Team!' });
});

module.exports = router;
