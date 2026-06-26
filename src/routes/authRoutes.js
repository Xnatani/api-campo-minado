const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.patch('/reset-password', (req, res) => authController.resetPassword(req, res));

module.exports = router;