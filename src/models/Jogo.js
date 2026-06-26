class Jogo {
    constructor(id, usuarioId, valorAposta, status = 'EM_ANDAMENTO', premioAtual = 0, diamantesEncontrados = 0) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.valorAposta = valorAposta;
        this.status = status;
        this.premioAtual = premioAtual;
        this.diamantesEncontrados = diamantesEncontrados;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = Jogo;