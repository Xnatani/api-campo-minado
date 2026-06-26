const bcrypt = require('bcrypt');
const UsuarioRepository = require('../repositories/UsuarioRepository');

class AuthService {
    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    validateSenha(senha) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return regex.test(senha);
    }

    async register(nome, email, dataNascimento, senha, confirmacaoSenha) {
        // Validar campos obrigatórios
        if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Validar confirmação de senha
        if (senha !== confirmacaoSenha) {
            throw new Error('As senhas não coincidem');
        }

        // Validar requisitos da senha
        if (!this.validateSenha(senha)) {
            throw new Error('A senha deve ter no mínimo 8 caracteres, uma maiúscula, um número e um caractere especial');
        }

        // Verificar email duplicado
        const usuarioExistente = await this.usuarioRepository.findByEmail(email);
        if (usuarioExistente) {
            throw new Error('Email já cadastrado');
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Criar usuário
        const usuario = {
            nome,
            email,
            dataNascimento,
            senhaHash,
            saldo: 0
        };

        const result = await this.usuarioRepository.create(usuario);
        return result;
    }

    async login(email, senha) {
        const usuario = await this.usuarioRepository.findByEmail(email);
        if (!usuario) {
            throw new Error('Email ou senha inválidos');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            throw new Error('Email ou senha inválidos');
        }

        return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            dataNascimento: usuario.data_nascimento
        };
    }

    async resetPassword(id, novaSenha) {
        // Validar requisitos da nova senha
        if (!this.validateSenha(novaSenha)) {
            throw new Error('A senha deve ter no mínimo 8 caracteres, uma maiúscula, um número e um caractere especial');
        }

        // Buscar usuário
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        // Verificar se a nova senha é igual à atual
        const senhaAtual = await this.usuarioRepository.findByEmail(usuario.email);
        const senhaIgual = await bcrypt.compare(novaSenha, senhaAtual.senha_hash);
        if (senhaIgual) {
            throw new Error('A nova senha não pode ser igual à senha atual');
        }

        // Hash da nova senha
        const salt = await bcrypt.genSalt(10);
        const novaSenhaHash = await bcrypt.hash(novaSenha, salt);

        // Atualizar senha
        await this.usuarioRepository.updateSenha(id, novaSenhaHash);
        return { message: 'Senha atualizada com sucesso' };
    }
}

module.exports = AuthService;