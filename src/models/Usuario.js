class Usuario {
    constructor(id, nome, email, dataNascimento, senhaHash, saldo = 0) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.dataNascimento = dataNascimento;
        this.senhaHash = senhaHash;
        this.saldo = saldo;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = Usuario;