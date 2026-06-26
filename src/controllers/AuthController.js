const AuthService = require('../services/AuthService');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async register(req, res) {
        try {
            const { nome, email, dataNascimento, senha, confirmacaoSenha } = req.body;
            const usuario = await this.authService.register(
                nome, email, dataNascimento, senha, confirmacaoSenha
            );
            res.status(201).json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await this.authService.login(email, senha);
            res.status(200).json(usuario);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { id, novaSenha } = req.body;
            const result = await this.authService.resetPassword(id, novaSenha);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AuthController;