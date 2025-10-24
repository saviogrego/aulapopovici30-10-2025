## API de Cadastro de Alunos e Cálculo de Médias

Este projeto é uma API em Node.js com TypeScript que se conecta a um banco de dados PostgreSQL. O objetivo principal é simular o cadastro de um aluno, coletar as notas de 8 provas em três disciplinas e salvar as informações básicas do aluno junto com as médias finais calculadas diretamente no código.

---

## Funcionalidades

* **Coleta de Dados:** Solicita Nome, Idade e Série do aluno via terminal.
* **Cálculo Dinâmico:** Solicita 8 notas para as matérias: Matemática, Geografia e História.
* **Persistência:** Calcula as médias de cada matéria e armazena **apenas as médias** e os dados básicos do aluno na tabela `alunos` do PostgreSQL.
* **Conexão Segura:** Utiliza o módulo `pg` para gerenciamento de pool de conexões com o banco de dados.

## Tecnologias Utilizadas

* **Linguagem:** TypeScript (Node.js)
* **Banco de Dados:** PostgreSQL
* **Gerenciamento de DB:** pgAdmin 4
* **Dependências:**
    * `pg`: Driver de banco de dados para PostgreSQL.
    * `readline-sync`: Para entrada de dados via terminal.
    * `typescript` / `ts-node`: Para desenvolvimento e execução em TypeScript.

---

## Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

1.  **Docker Desktop** (para rodar o PostgreSQL).
2.  **Node.js e NPM** instalados.
3.  **Git** instalado.

### 1. Clonar o Repositório

```bash
git clone [URL_DO_REPOSITORIO_AQUI]
cd nome-do-projeto