"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Usando a sintaxe 'import' recomendada para módulos modernos em TypeScript
const pg_1 = require("pg");
const readlineSync = __importStar(require("readline-sync")); // Importa todas as funções sob um alias
// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
// Tipagem explícita da configuração do banco de dados
const dbConfig = {
    user: 'aluno',
    host: 'localhost',
    database: 'db_profedu',
    password: '102030',
    port: 5432,
};
const pool = new pg_1.Pool(dbConfig);
/**
 * Função utilitária para coletar 8 notas e calcular a média.
 * * @param materia - Nome da matéria para exibição (string).
 * @returns A média das 8 notas (number).
 */
// CORREÇÃO: Declarando o tipo 'string' para o parâmetro 'materia' e ': number' para o retorno.
function calcularMedia(materia) {
    console.log(`\n--- Notas de ${materia} ---`);
    // Boa prática: Tipar as variáveis
    let notas = [];
    let soma = 0;
    for (let i = 1; i <= 8; i++) {
        // questionFloat retorna um number ou NaN
        let nota = readlineSync.questionFloat(`Digite a nota ${i} (${materia}): `);
        // Validação básica
        if (isNaN(nota) || nota < 0 || nota > 10) {
            console.error("Nota inválida. Digite novamente.");
            i--;
            continue;
        }
        notas.push(nota);
        soma += nota;
    }
    const media = soma / 8;
    // Retorna a média arredondada para duas casas decimais
    return parseFloat(media.toFixed(2));
}
async function inserirDadosComMedia() {
    console.log("==================================================");
    console.log("          API de Cadastro e Cálculo de Médias     ");
    console.log("==================================================");
    // 1. Coleta dos Dados Básicos
    const nome = readlineSync.question('Nome do aluno: ');
    const idade = readlineSync.questionInt('Idade: ');
    const serie = readlineSync.question('Série: ');
    if (!nome || !idade || !serie) {
        console.error("\nErro: Nome, Idade e Série são obrigatórios! Operação cancelada.");
        await pool.end();
        return;
    }
    // 2. Coleta das Notas e Cálculo das Médias
    const mediaMatematica = calcularMedia('Matemática');
    const mediaGeografia = calcularMedia('Geografia');
    // CORREÇÃO DE BUG (Typo): A função estava sendo chamada com 'calcularMediaMedia'
    // Garantindo que seja 'calcularMedia'
    const mediaHistoria = calcularMedia('História');
    console.log("\n--- Resultados dos Cálculos ---");
    console.log(`Média de Matemática: ${mediaMatematica}`);
    console.log(`Média de Geografia: ${mediaGeografia}`);
    console.log(`Média de História: ${mediaHistoria}`);
    // 3. Inserção no Banco de Dados
    try {
        console.log("\nConectando ao banco de dados...");
        const client = await pool.connect();
        console.log("Conexão bem-sucedida! Inserindo dados...");
        const insertQuery = `
            INSERT INTO public.alunos (nome, idade, serie, media_mat, media_geo, media_hist)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [
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
    }
    catch (error) {
        // É comum em TS checar se o erro é um objeto Error
        console.error("\n Ocorreu um erro ao interagir com o banco de dados:", error.message);
    }
    finally {
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}
inserirDadosComMedia();
