# Projeto de Teste: Conexão TypeScript com PostgreSQL

Olá, alunos do professor Eduardo Popovici!

Você pode precisar montar um banco de dados para realizar a atividade. Para isso utilize a postagem pela URL https://www.eduardopopovici.com/2025/09/como-montar-um-conteiner-com-postgre.html 

Este é um projeto simples, criado como material de apoio para a aula, com o objetivo de demonstrar uma funcionalidade essencial no desenvolvimento de software: **conectar uma aplicação a um banco de dados e inserir informações**.

Importante, os passos de como executar de fim a fim, serão realizados em sala de aulas.

<img width="1240" height="677" alt="image" src="https://github.com/user-attachments/assets/74b13711-87cc-4b2f-9077-c5a6c5478079" />

Dica, programe escutando música, vai te ajudar durante o processo. Aqui vai minha recomendação https://www.youtube.com/watch?v=kWRScWjjLIY

---

### O Que Este Projeto Faz?

A funcionalidade do script é muito direta:

1.  **Conecta-se** a um banco de dados PostgreSQL (que deve estar rodando via Docker).
2.  **Pede ao usuário** para digitar um nome, uma idade e uma data de nascimento diretamente no terminal.
3.  **Executa um comando SQL `INSERT`** para salvar esses dados em uma tabela chamada `pessoas`.
4.  **Encerra a conexão** de forma segura.

<img width="1586" height="897" alt="image" src="https://github.com/user-attachments/assets/5aee0574-e544-4094-8765-80e5b86c0a87" />

### Quais ferramentas você vai precisar?

1. VSCode
2. Docker
3. PGAdmin
4. Typescript - NodeJS
5. GitBash

<img width="1916" height="1018" alt="image" src="https://github.com/user-attachments/assets/149ff003-802f-4ba5-8020-f6de3d902db4" />


---

### ⚠️ Aviso de Segurança Importante: Credenciais no Código

No arquivo `ExercicioBancoDeDados.ts`, o usuário e a senha do banco de dados estão escritos diretamente no código (uma prática conhecida como *hardcoding*).

```typescript
const dbConfig = {
    user: 'aluno',
    host: 'localhost',
    database: 'db_profedu',
    password: '102030', // <--- PERIGO!
    port: 5432,
};
```

**Para um exercício em aula, isso é aceitável para simplificar o aprendizado.** No entanto, em um projeto real, **isso é uma falha de segurança gravíssima**. Se este código fosse enviado para um repositório público no GitHub, qualquer pessoa poderia ver suas credenciais e obter acesso total ao seu banco de dados.

A maneira correta de gerenciar informações sensíveis como essa é usar **Variáveis de Ambiente**, geralmente com o auxílio de arquivos `.env` e bibliotecas como `dotenv`.

---

### Estrutura do Projeto

Ao clonar ou criar o projeto, você encontrará os seguintes arquivos e diretórios principais:

```
/ESCREVER-NO-BANCO
|
|-- /dist/
|   |-- ExercicioBancoDeDados.js  <-- O código JavaScript compilado que será executado.
|
|-- /node_modules/
|   |-- ... (várias pastas)     <-- Dependências e bibliotecas do projeto.
|
|-- ExercicioBancoDeDados.ts      <-- Nosso código-fonte principal, escrito em TypeScript.
|
|-- package.json                  <-- O "RG" do projeto: lista as dependências e scripts.
|
|-- tsconfig.json                 <-- Arquivo de configuração com as regras para o compilador TypeScript.
|
|-- README.md                     <-- Este arquivo de documentação.
```

---

### Como Executar o Projeto

Siga os passos abaixo no terminal, dentro da pasta do projeto.

#### Pré-requisitos
1.  Ter o **Node.js** instalado na sua máquina.
2.  Garantir que o **container Docker do PostgreSQL** esteja em execução.

#### Passo a Passo

1.  **Instalar as Dependências**
    Este comando lê o `package.json` e baixa todas as bibliotecas necessárias (como `pg` e `readline-sync`) para a pasta `node_modules`.
    ```bash
    npm install
    ```

2.  **Compilar o Código TypeScript**
    Este comando invoca o compilador do TypeScript (`tsc`), que lê o arquivo `ExercicioBancoDeDados.ts`, segue as regras do `tsconfig.json`, e gera o arquivo JavaScript correspondente dentro da pasta `/dist`.
    ```bash
    npx tsc
    ```

3.  **Executar o Programa**
    Agora, executamos o arquivo JavaScript que foi gerado no passo anterior.
    ```bash
    node dist/ExercicioBancoDeDados.js
    ```
<img width="1913" height="1017" alt="image" src="https://github.com/user-attachments/assets/3cdfb7a7-cec9-4bac-b12e-a5d4fd5b7b5b" />

Ao executar o último comando, o terminal irá fazer as perguntas. Após respondê-las, verifique no pgAdmin se os novos dados apareceram na sua tabela `pessoas`!

Quando acessar o banco de dados, será possível validar se houve a escrita ou não.

<img width="1903" height="1018" alt="image" src="https://github.com/user-attachments/assets/48e94be0-8ee9-46c2-acbc-e5a2a87911fb" />


Bons estudos!
