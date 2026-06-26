# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas

- Node.js (v24.15.0)
- Express.js
- PostgreSQL
- dotenv
- cors
- nodemon
- bcrypt (para hash de senhas)

## Integrantes

- Otávio Sidnei dos Santos Andrade
- Jõao Lucas Rodrigues e Silva


## Instalação

Clone o repositório:
```bash
git clone https://github.com/usuario/api-campo-minado.git
```
# Servidor
PORT=3000

# Banco de Dados
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```
# Segurança
```bash
JWT_SECRET=minha_chave_secreta_123
```
# Configuração do Banco de Dados

## 1. Crie o banco de dados no PostgreSQL
```bash
CREATE DATABASE campo_minado;
```
## 2. Execute o script de criação das tabelas
```bash
-- Tabela de usuários
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

-- Tabela de jogos
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

-- Tabela de posições do tabuleiro
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
```
# Executando a Aplicação
## Execute
```bash
npm run dev
npm start
```
A API estará disponível em:
```bash
http://localhost:3000
```
# Endpoints da API
## Autenticação
| Método | Rota | Descrição |
|----------|----------|----------|
| POST  | /auth/register  | Cadastrar novo usuário  |
| POST  | /auth/login   | Autenticar usuário  |
| PATCH | /auth/reset-password | Redefinir senha |

## Exemplo de Requisição - Cadastro
```bash
POST /auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}
```
## Exemplo de Requisição - Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "Senha@123"
}
```
## Usuários
|Método	|Rota	|Descrição|
|----------|----------|----------|
|GET	|/users/{id}	|Buscar dados do usuário|
|GET	|/users/{id}/dashboard	|Buscar estatísticas pessoais|
|PUT	|/users/{id}	|Atualizar saldo|
|DELETE	|/users/{id}	|Excluir usuário|

## Exemplo de Resposta - Dashboard
```bash
{
  "totalJogos": 20,
  "vitorias": 12,
  "derrotas": 8,
  "valorGanho": 450.00,
  "valorPerdido": 220.00
}
```
## Jogos
|Método	|Rota	|Descrição|
|-|-|-|
|POST	|/games/start	|Iniciar nova aposta|
|POST	|/games/{gameId}/reveal	|Revelar posição do tabuleiro|
|POST	|/games/{gameId}/cashout	|Encerrar aposta e sacar prêmio|

## Exemplo - Iniciar Jogo
```bash
POST /games/start
Content-Type: application/json

{
  "idUser": 1,
  "valorAposta": 100
}
```
## Exemplo - Revelar Posição
```bash
POST /games/1/reveal
Content-Type: application/json

{
  "linha": 2,
  "coluna": 3
}
```
# Regras de Negócio
## Cadastro de Usuário
- Campos obrigatórios: Nome, Email, Data de nascimento, Senha, Confirmação de senha
- Senha deve ter: Mínimo 8 caracteres, 1 letra maiúscula, 1 número, 1 caractere especial
- Email deve ser único no sistema

## Jogo Campo Minado
- Tabuleiro 5x5 (linhas 0-4, colunas 0-4)
- 3 Diamantes e 22 Bombas distribuídos aleatoriamente
- Cada diamante encontrado multiplica o prêmio
- Ao encontrar uma bomba, o jogo termina com DERROTA
- Ao encontrar os 3 diamantes, o jogo termina com VITÓRIA

### Fórmula de Premiação
```bash
Prêmio = ValorAposta × (1 + (QuantidadeDiamantes × 0.33))
```
# Testando a API
## Usando Thunder Client (VS Code)
Instale a extensão Thunder Client

Abra o Thunder Client (ícone ⚡ na barra lateral)

Crie uma nova requisição para cada endpoint

Configure o método HTTP e a URL

Adicione o Body JSON quando necessário

Clique em Send

## Usando cURL (Terminal)
```bash
# Cadastrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com","dataNascimento":"1990-01-01","senha":"Senha@123","confirmacaoSenha":"Senha@123"}'

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"Senha@123"}'

# Iniciar jogo
curl -X POST http://localhost:3000/games/start \
  -H "Content-Type: application/json" \
  -d '{"idUser":1,"valorAposta":100}'
```
## Fluxo de Teste Completo
Cadastrar usuário → POST /auth/register

Fazer login → POST /auth/login

Adicionar saldo → PUT /users/1 (body: {"saldo": 1000})

Iniciar jogo → POST /games/start (body: {"idUser": 1, "valorAposta": 100})

Revelar posições → POST /games/1/reveal (body: {"linha": 0, "coluna": 0})

Sacar prêmio → POST /games/1/cashout

Ver estatísticas → GET /users/1/dashboard

# Licença
Este projeto foi desenvolvido para fins educacionais como trabalho da disciplina de Back-End.
