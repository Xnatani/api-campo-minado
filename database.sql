CREATE DATABASE campo_minado;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jogos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    valor_aposta DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'EM_ANDAMENTO',
    premio_atual DECIMAL(10,2) DEFAULT 0,
    diamantes_encontrados INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE posicoes_tabuleiro (
    id SERIAL PRIMARY KEY,
    jogo_id INTEGER NOT NULL,
    linha INTEGER NOT NULL,
    coluna INTEGER NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    revelada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    UNIQUE(jogo_id, linha, coluna)
);