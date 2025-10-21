// Usando a sintaxe CommonJS 'require' que é 100% compatível
const { Pool } = require('pg');
const readlineSync = require('readline-sync');

// Nunca use senha e usuario nos codgos - este é apenas um exemplo de aulas
// No mundo real isso é uma baita vulnerabilidade
const dbConfig = {
    user: 'aluno',
    host: 'localhost',
    database: 'db_profedu',
    password: '102030',
    port: 5432,
};

const pool = new Pool(dbConfig);

async function inserirDados() {
    console.log("--- Cadastro de Novo Aluno ---");

    const nome = readlineSync.question('Digite o nome: ');
    const idade = readlineSync.questionInt('Digite a idade: ');
    const dataNasc = readlineSync.question('Digite a data de nascimento (formato AAAA-MM-DD): ');

    if (!nome || !idade || !dataNasc) {
        console.error("Erro: Todos os campos são obrigatórios! Operação cancelada.");
        await pool.end();
        return;
    }

    try {
        console.log("\nConectando ao banco de dados...");
        const client = await pool.connect();
        console.log("Conexão bem-sucedida! Inserindo dados...");

        const insertQuery = `
            INSERT INTO public.pessoas (nome, idade, data_nasc)
            VALUES ($1, $2, $3)
        `;
        const values = [nome, idade, dataNasc];

        await client.query(insertQuery, values);
        client.release();

        console.log("-----------------------------------------");
        console.log(`Dados inseridos com sucesso!`);
        console.log(`Nome: ${nome}, Idade: ${idade}, Nascimento: ${dataNasc}`);
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("Ocorreu um erro ao interagir com o banco de dados:", error);
    } finally {
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}

inserirDados();
