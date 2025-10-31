//feito por:
// Sávio grego - RA: 2510472
// Gabriel de Oliveira - RA: 2507887

--API de Quiz de Perguntas e Respostas

Este projeto é uma API em Node.js com TypeScript que se conecta a um banco de dados PostgreSQL. O objetivo principal é simular um quiz de perguntas, permitindo cadastrar perguntas com alternativas, executar o quiz via terminal e registrar os resultados dos usuários no banco de dados.

---Funcionalidades

Cadastro de Perguntas: Permite cadastrar perguntas com 3 alternativas e indicar qual é a correta.

Execução do Quiz: Solicita ao usuário que responda todas as perguntas cadastradas e calcula a pontuação final.

Persistência de Resultados: Armazena o nome do usuário e a pontuação no banco de dados PostgreSQL.

Consulta de Resultados: Permite listar todos os usuários e suas pontuações com data e hora.

Conexão Segura: Utiliza o módulo pg para gerenciamento de pool de conexões com o banco de dados.

---Tecnologias Utilizadas

Linguagem: TypeScript (Node.js)

Banco de Dados: PostgreSQL

Gerenciamento de DB: pgAdmin 4 (opcional)

Dependências:

pg: Driver para PostgreSQL

readline-sync: Para entrada de dados via terminal

typescript / ts-node: Para desenvolvimento e execução do código TypeScript

Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto localmente.

Pré-requisitos

PostgreSQL instalado e rodando (pode usar Docker ou pgAdmin).

Node.js e npm instalados.

Git instalado.

1. Clonar o Repositório
git clone [(https://github.com/saviogrego/aulapopovici30-10-2025.git)]
cd ExercicioBancoDeDados

2. Instalar Dependências
npm install

3. Configurar o Banco de Dados

Certifique-se de ter um banco PostgreSQL criado e altere as configurações no arquivo src/quiz.ts:

const pool = new Pool({
  user: "aluno",
  host: "localhost",
  database: "db_profedu",
  password: "102030",
  port: 5432,
});


Ajuste user, database, password e port de acordo com sua instalação.

Crie as tabelas necessárias:

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS perguntas (
    id SERIAL PRIMARY KEY,
    texto TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alternativas (
    id SERIAL PRIMARY KEY,
    pergunta_id INT REFERENCES perguntas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    correta BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS resultados (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    pontuacao INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

4. Compilar TypeScript
npx tsc


O JavaScript gerado ficará na pasta dist/.

5. Executar o Quiz
node dist/ExercicioBancoDeDados.js


O menu principal permitirá:

Cadastrar perguntas

Executar o quiz

Listar usuários e pontuações

Sair
