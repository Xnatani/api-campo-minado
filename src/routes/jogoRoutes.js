const express = require('express');
const JogoController = require('../controllers/JogoController');

const router = express.Router();
const jogoController = new JogoController();

router.post('/start', (req, res) => jogoController.startGame(req, res));
router.post('/:gameId/reveal', (req, res) => jogoController.revealPosition(req, res));
router.post('/:gameId/cashout', (req, res) => jogoController.cashout(req, res));

module.exports = router;