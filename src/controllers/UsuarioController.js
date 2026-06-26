const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    constructor() {
        this.usuarioService = new UsuarioService();
    }

    async getUsuario(req, res) {
        try {
            const { id } = req.params;
            const usuario = await this.usuarioService.getUsuario(parseInt(id));
            res.status(200).json(usuario);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getDashboard(req, res) {
        try {
            const { id } = req.params;
            const estatisticas = await this.usuarioService.getDashboard(parseInt(id));
            res.status(200).json(estatisticas);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateSaldo(req, res) {
        try {
            const { id } = req.params;
            const { saldo } = req.body;
            const usuario = await this.usuarioService.updateSaldo(parseInt(id), saldo);
            res.status(200).json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            const result = await this.usuarioService.deleteUsuario(parseInt(id));
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = UsuarioController;