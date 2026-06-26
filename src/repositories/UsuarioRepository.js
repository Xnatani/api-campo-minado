const pool = require('../config/database');

class UsuarioRepository {
    async create(usuario) {
        const query = `
            INSERT INTO usuarios (nome, email, data_nascimento, senha_hash, saldo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nome, email, data_nascimento, saldo
        `;
        const values = [usuario.nome, usuario.email, usuario.dataNascimento, usuario.senhaHash, usuario.saldo];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async findByEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    async findById(id) {
        const query = 'SELECT id, nome, email, data_nascimento, saldo FROM usuarios WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    async updateSaldo(id, novoSaldo) {
        const query = 'UPDATE usuarios SET saldo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, nome, email, saldo';
        const result = await pool.query(query, [novoSaldo, id]);
        return result.rows[0];
    }

    async updateSenha(id, novaSenhaHash) {
        const query = 'UPDATE usuarios SET senha_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
        await pool.query(query, [novaSenhaHash, id]);
    }

    async delete(id) {
        const query = 'DELETE FROM usuarios WHERE id = $1';
        await pool.query(query, [id]);
    }

    async getEstatisticas(id) {
        const query = `
            SELECT 
                COUNT(*) as total_jogos,
                COUNT(CASE WHEN status = 'VITORIA' THEN 1 END) as vitorias,
                COUNT(CASE WHEN status = 'DERROTA' THEN 1 END) as derrotas,
                COALESCE(SUM(CASE WHEN status = 'VITORIA' THEN premio_atual ELSE 0 END), 0) as valor_ganho,
                COALESCE(SUM(CASE WHEN status = 'DERROTA' THEN valor_aposta ELSE 0 END), 0) as valor_perdido
            FROM jogos
            WHERE usuario_id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = UsuarioRepository;