const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');

const router = express.Router();
const usuarioController = new UsuarioController();

router.get('/:id', (req, res) => usuarioController.getUsuario(req, res));
router.get('/:id/dashboard', (req, res) => usuarioController.getDashboard(req, res));
router.put('/:id', (req, res) => usuarioController.updateSaldo(req, res));
router.delete('/:id', (req, res) => usuarioController.deleteUsuario(req, res));

module.exports = router;