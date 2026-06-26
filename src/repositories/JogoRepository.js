const pool = require('../config/database');

class JogoRepository {
    async create(jogo) {
        const query = `
            INSERT INTO jogos (usuario_id, valor_aposta, status, premio_atual, diamantes_encontrados)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const values = [jogo.usuarioId, jogo.valorAposta, jogo.status, jogo.premioAtual, jogo.diamantesEncontrados];
        const result = await pool.query(query, values);
        return result.rows[0].id;
    }

    async findJogoEmAndamento(usuarioId) {
        const query = 'SELECT * FROM jogos WHERE usuario_id = $1 AND status = $2';
        const result = await pool.query(query, [usuarioId, 'EM_ANDAMENTO']);
        return result.rows[0];
    }

    async findById(id) {
        const query = 'SELECT * FROM jogos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async updateStatus(id, status, premioAtual = null, diamantesEncontrados = null) {
        let query = 'UPDATE jogos SET status = $1, updated_at = CURRENT_TIMESTAMP';
        const values = [status];
        
        if (premioAtual !== null) {
            query += ', premio_atual = $2';
            values.push(premioAtual);
        }
        if (diamantesEncontrados !== null) {
            const paramIndex = values.length;
            query += `, diamantes_encontrados = $${paramIndex + 1}`;
            values.push(diamantesEncontrados);
        }
        
        query += ' WHERE id = $' + (values.length + 1);
        values.push(id);
        
        await pool.query(query, values);
    }

    async criarPosicoesTabuleiro(jogoId, posicoes) {
        const query = `
            INSERT INTO posicoes_tabuleiro (jogo_id, linha, coluna, tipo)
            VALUES ($1, $2, $3, $4)
        `;
        for (const pos of posicoes) {
            await pool.query(query, [jogoId, pos.linha, pos.coluna, pos.tipo]);
        }
    }

    async getPosicao(jogoId, linha, coluna) {
        const query = 'SELECT * FROM posicoes_tabuleiro WHERE jogo_id = $1 AND linha = $2 AND coluna = $3';
        const result = await pool.query(query, [jogoId, linha, coluna]);
        return result.rows[0];
    }

    async getPosicoesReveladas(jogoId) {
        const query = 'SELECT * FROM posicoes_tabuleiro WHERE jogo_id = $1 AND revelada = true';
        const result = await pool.query(query, [jogoId]);
        return result.rows;
    }

    async revelarPosicao(jogoId, linha, coluna) {
        const query = 'UPDATE posicoes_tabuleiro SET revelada = TRUE WHERE jogo_id = $1 AND linha = $2 AND coluna = $3';
        await pool.query(query, [jogoId, linha, coluna]);
    }
}

module.exports = JogoRepository;