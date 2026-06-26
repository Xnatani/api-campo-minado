const JogoRepository = require('../repositories/JogoRepository');
const UsuarioRepository = require('../repositories/UsuarioRepository');

class JogoService {
    constructor() {
        this.jogoRepository = new JogoRepository();
        this.usuarioRepository = new UsuarioRepository();
    }

    gerarTabuleiro() {
        const posicoes = [];
        const tipos = ['DIAMANTE', 'BOMBA'];
        const distribuicao = [];
        
        // 5x5 = 25 posições
        // 3 diamantes e 22 bombas (distribuição aleatória)
        for (let i = 0; i < 25; i++) {
            distribuicao.push(i < 3 ? 'DIAMANTE' : 'BOMBA');
        }
        
        // Embaralhar
        for (let i = distribuicao.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [distribuicao[i], distribuicao[j]] = [distribuicao[j], distribuicao[i]];
        }

        let index = 0;
        for (let linha = 0; linha < 5; linha++) {
            for (let coluna = 0; coluna < 5; coluna++) {
                posicoes.push({
                    linha,
                    coluna,
                    tipo: distribuicao[index++]
                });
            }
        }

        return posicoes;
    }

    async startGame(idUser, valorAposta) {
        // Validar saldo
        const usuario = await this.usuarioRepository.findById(idUser);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        if (usuario.saldo < valorAposta) {
            throw new Error('Saldo insuficiente');
        }

        // Verificar se há jogo em andamento
        const jogoEmAndamento = await this.jogoRepository.findJogoEmAndamento(idUser);
        if (jogoEmAndamento) {
            throw new Error('Usuário possui uma partida em andamento');
        }

        // Debitar aposta
        const novoSaldo = usuario.saldo - valorAposta;
        await this.usuarioRepository.updateSaldo(idUser, novoSaldo);

        // Criar jogo
        const jogo = {
            usuarioId: idUser,
            valorAposta: valorAposta,
            status: 'EM_ANDAMENTO',
            premioAtual: 0,
            diamantesEncontrados: 0
        };

        const gameId = await this.jogoRepository.create(jogo);

        // Gerar e salvar tabuleiro
        const posicoes = this.gerarTabuleiro();
        await this.jogoRepository.criarPosicoesTabuleiro(gameId, posicoes);

        return { gameId };
    }

    async revealPosition(gameId, linha, coluna) {
        // Verificar se o jogo existe e está em andamento
        const jogo = await this.jogoRepository.findById(gameId);
        if (!jogo) {
            throw new Error('Jogo não encontrado');
        }

        if (jogo.status !== 'EM_ANDAMENTO') {
            throw new Error('Este jogo já foi finalizado');
        }

        // Validar posição
        if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
            throw new Error('Posição inválida');
        }

        // Verificar se posição já foi revelada
        const posicao = await this.jogoRepository.getPosicao(gameId, linha, coluna);
        if (!posicao) {
            throw new Error('Posição não encontrada');
        }

        if (posicao.revelada) {
            throw new Error('Esta posição já foi revelada');
        }

        // Revelar posição
        await this.jogoRepository.revelarPosicao(gameId, linha, coluna);

        // Verificar resultado
        if (posicao.tipo === 'BOMBA') {
            // Perdeu
            await this.jogoRepository.updateStatus(gameId, 'DERROTA');
            return {
                resultado: 'BOMBA',
                status: 'PERDIDO'
            };
        } else {
            // Diamante encontrado
            const novosDiamantes = (jogo.diamantes_encontrados || 0) + 1;
            
            // Calcular prêmio
            const premio = jogo.valor_aposta * (1 + (novosDiamantes * 0.33));
            
            await this.jogoRepository.updateStatus(gameId, 'EM_ANDAMENTO', premio, novosDiamantes);

            // Verificar se todos os diamantes foram encontrados (vitória)
            if (novosDiamantes === 3) {
                await this.jogoRepository.updateStatus(gameId, 'VITORIA', premio, novosDiamantes);
                // Creditar prêmio
                const usuario = await this.usuarioRepository.findById(jogo.usuario_id);
                const novoSaldo = usuario.saldo + premio;
                await this.usuarioRepository.updateSaldo(jogo.usuario_id, novoSaldo);
                return {
                    resultado: 'DIAMANTE',
                    diamantesEncontrados: novosDiamantes,
                    premioAtual: premio,
                    status: 'VITORIA'
                };
            }

            return {
                resultado: 'DIAMANTE',
                diamantesEncontrados: novosDiamantes,
                premioAtual: premio
            };
        }
    }

    async cashout(gameId) {
        const jogo = await this.jogoRepository.findById(gameId);
        if (!jogo) {
            throw new Error('Jogo não encontrado');
        }

        if (jogo.status !== 'EM_ANDAMENTO') {
            throw new Error('Este jogo já foi finalizado');
        }

        // Calcular valor final
        const premioAtual = jogo.premio_atual || 0;
        
        // Creditar saldo
        if (premioAtual > 0) {
            const usuario = await this.usuarioRepository.findById(jogo.usuario_id);
            const novoSaldo = usuario.saldo + premioAtual;
            await this.usuarioRepository.updateSaldo(jogo.usuario_id, novoSaldo);
        }

        // Finalizar partida
        await this.jogoRepository.updateStatus(gameId, 'FINALIZADO');
        return {
            message: 'Aposta encerrada com sucesso',
            valorFinal: premioAtual
        };
    }
}

module.exports = JogoService;