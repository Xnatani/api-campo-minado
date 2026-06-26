const JogoService = require('../services/JogoService');

class JogoController {
    constructor() {
        this.jogoService = new JogoService();
    }

    async startGame(req, res) {
        try {
            const { idUser, valorAposta } = req.body;
            const result = await this.jogoService.startGame(idUser, valorAposta);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async revealPosition(req, res) {
        try {
            const { gameId } = req.params;
            const { linha, coluna } = req.body;
            const result = await this.jogoService.revealPosition(
                parseInt(gameId), 
                parseInt(linha), 
                parseInt(coluna)
            );
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async cashout(req, res) {
        try {
            const { gameId } = req.params;
            const result = await this.jogoService.cashout(parseInt(gameId));
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = JogoController;