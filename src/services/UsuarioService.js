const UsuarioRepository = require('../repositories/UsuarioRepository');

class UsuarioService {
    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    async getUsuario(id) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    }

    async getDashboard(id) {
        const estatisticas = await this.usuarioRepository.getEstatisticas(id);
        return {
            totalJogos: parseInt(estatisticas.total_jogos) || 0,
            vitorias: parseInt(estatisticas.vitorias) || 0,
            derrotas: parseInt(estatisticas.derrotas) || 0,
            valorGanho: parseFloat(estatisticas.valor_ganho) || 0,
            valorPerdido: parseFloat(estatisticas.valor_perdido) || 0
        };
    }

    async updateSaldo(id, saldo) {
        // Validar saldo negativo
        if (saldo < 0) {
            throw new Error('Não é permitido cadastrar saldo negativo');
        }

        // Validar duas casas decimais
        if (!Number.isFinite(saldo) || !/^\d+(\.\d{1,2})?$/.test(saldo.toString())) {
            throw new Error('O saldo deve ter no máximo duas casas decimais');
        }

        const usuario = await this.usuarioRepository.updateSaldo(id, saldo);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    }

    async deleteUsuario(id) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        await this.usuarioRepository.delete(id);
        return { message: 'Usuário deletado com sucesso' };
    }
}

module.exports = UsuarioService;