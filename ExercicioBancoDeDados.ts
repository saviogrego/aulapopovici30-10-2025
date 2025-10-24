// Usando a sintaxe 'import' recomendada para módulos modernos em TypeScript
import { Pool } from 'pg';
import * as readlineSync from 'readline-sync'; // Importa todas as funções sob um alias

// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
// Tipagem explícita da configuração do banco de dados
const dbConfig = {
    user: 'aluno',
    host: 'localhost',
    database: 'db_profedu',
    password: '102030',
    port: 5432,
};

const pool = new Pool(dbConfig);


/**
 * Função utilitária para coletar 8 notas e calcular a média.
 * * @param materia - Nome da matéria para exibição (string).
 * @returns A média das 8 notas (number).
 */
// CORREÇÃO: Declarando o tipo 'string' para o parâmetro 'materia' e ': number' para o retorno.
function calcularMedia(materia: string): number {
    console.log(`\n--- Notas de ${materia} ---`);
    
    // Boa prática: Tipar as variáveis
    let notas: number[] = []; 
    let soma: number = 0;

    for (let i = 1; i <= 8; i++) {
        // questionFloat retorna um number ou NaN
        let nota: number = readlineSync.questionFloat(`Digite a nota ${i} (${materia}): `); 
        
        // Validação básica
        if (isNaN(nota) || nota < 0 || nota > 10) {
            console.error("Nota inválida. Digite novamente.");
            i--; 
            continue;
        }
        notas.push(nota);
        soma += nota;
    }

    const media: number = soma / 8;
    // Retorna a média arredondada para duas casas decimais
    return parseFloat(media.toFixed(2));
}


async function inserirDadosComMedia(): Promise<void> { // Usando Promise<void> para tipar o retorno assíncrono
    console.log("==================================================");
    console.log("          API de Cadastro e Cálculo de Médias     ");
    console.log("==================================================");

    // 1. Coleta dos Dados Básicos
    const nome: string = readlineSync.question('Nome do aluno: ');
    const idade: number = readlineSync.questionInt('Idade: ');
    const serie: string = readlineSync.question('Série: ');

    if (!nome || !idade || !serie) {
        console.error("\nErro: Nome, Idade e Série são obrigatórios! Operação cancelada.");
        await pool.end();
        return;
    }

    // 2. Coleta das Notas e Cálculo das Médias
    const mediaMatematica: number = calcularMedia('Matemática');
    const mediaGeografia: number = calcularMedia('Geografia');
    
    // CORREÇÃO DE BUG (Typo): A função estava sendo chamada com 'calcularMediaMedia'
    // Garantindo que seja 'calcularMedia'
    const mediaHistoria: number = calcularMedia('História'); 

    console.log("\n--- Resultados dos Cálculos ---");
    console.log(`Média de Matemática: ${mediaMatematica}`);
    console.log(`Média de Geografia: ${mediaGeografia}`);
    console.log(`Média de História: ${mediaHistoria}`);
    
    // 3. Inserção no Banco de Dados
    try {
        console.log("\nConectando ao banco de dados...");
        const client = await pool.connect();
        console.log("Conexão bem-sucedida! Inserindo dados...");

        const insertQuery: string = `
            INSERT INTO public.alunos (nome, idade, serie, media_mat, media_geo, media_hist)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values: (string | number)[] = [ // Tipando explicitamente o array de valores
            nome, 
            idade, 
            serie, 
            mediaMatematica, 
            mediaGeografia, 
            mediaHistoria
        ];

        await client.query(insertQuery, values);
        client.release();

        console.log("\n==================================================");
        console.log(` Dados do aluno inseridos com sucesso!`);
        console.log("==================================================");

    } catch (error) {
        // É comum em TS checar se o erro é um objeto Error
        console.error("\n Ocorreu um erro ao interagir com o banco de dados:", (error as Error).message);
    } finally {
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}

inserirDadosComMedia();