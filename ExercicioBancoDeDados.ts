//feito por:
// Sávio grego - RA: 2510472
// Gabriel de Oliveira - RA: 2507887



// src/quiz.ts
import { Pool } from "pg";
import * as readlineSync from "readline-sync";

// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
const pool = new Pool({
  user: "aluno",
  host: "localhost",
  database: "db_profedu",
  password: "102030",
  port: 5432,
});

// --- FUNÇÃO PARA CADASTRAR PERGUNTAS ---
async function cadastrarPergunta(): Promise<void> {
  const texto = readlineSync.question("Digite o texto da pergunta: ");
  if (!texto.trim()) {
    console.log("Texto inválido. Operação cancelada.");
    return;
  }

  const alternativas: { texto: string; correta: boolean }[] = [];
  console.log("Cadastre as 3 alternativas:");

  for (let i = 1; i <= 3; i++) {
    const textoAlt = readlineSync.question(`Alternativa ${i}: `);
    alternativas.push({ texto: textoAlt, correta: false });
  }

  let correta = readlineSync.questionInt("Qual alternativa é a correta? (1, 2 ou 3): ");
  while (![1, 2, 3].includes(correta)) {
    correta = readlineSync.questionInt("Digite 1, 2 ou 3 para indicar a correta: ");
  }
  alternativas[correta - 1].correta = true;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const res = await client.query(
      "INSERT INTO perguntas (texto) VALUES ($1) RETURNING id",
      [texto]
    );
    const perguntaId = res.rows[0].id;

    for (const alt of alternativas) {
      await client.query(
        "INSERT INTO alternativas (pergunta_id, texto, correta) VALUES ($1, $2, $3)",
        [perguntaId, alt.texto, alt.correta]
      );
    }

    await client.query("COMMIT");
    console.log("Pergunta cadastrada com sucesso!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao cadastrar pergunta:", (err as Error).message);
  } finally {
    client.release();
  }
}

// --- FUNÇÃO PARA EXECUTAR O QUIZ ---
async function executarQuiz(): Promise<void> {
  const perguntasRes = await pool.query(
    `SELECT p.id, p.texto, 
            json_agg(json_build_object('id', a.id, 'texto', a.texto)) AS alternativas
     FROM perguntas p
     JOIN alternativas a ON a.pergunta_id = p.id
     GROUP BY p.id
     ORDER BY p.id`
  );

  const perguntas = perguntasRes.rows;
  if (perguntas.length === 0) {
    console.log("Nenhuma pergunta cadastrada.");
    return;
  }

  console.log(`\n--- Iniciando o quiz (${perguntas.length} perguntas) ---\n`);

  let acertos = 0;
  const client = await pool.connect();

  try {
    for (const p of perguntas) {
      console.log(`Pergunta ${p.id}: ${p.texto}`);
      p.alternativas.forEach((a: any, i: number) =>
        console.log(`  ${i + 1}) ${a.texto}`)
      );

      let escolha = readlineSync.questionInt("Escolha (1, 2 ou 3): ");
      while (![1, 2, 3].includes(escolha)) {
        escolha = readlineSync.questionInt("Escolha inválida. Digite 1, 2 ou 3: ");
      }

      const alternativaEscolhida = p.alternativas[escolha - 1];
      const verif = await client.query(
        "SELECT correta FROM alternativas WHERE id = $1",
        [alternativaEscolhida.id]
      );

      if (verif.rows[0].correta) {
        acertos++;
      }
      console.log("");
    }

    const nome = readlineSync.question("Digite seu nome: ");
    if (!nome.trim()) {
      console.log("Nome inválido. Resultado não salvo.");
      return;
    }

    await client.query("BEGIN");
    const usuarioRes = await client.query(
      "INSERT INTO usuarios (nome) VALUES ($1) RETURNING id",
      [nome]
    );
    const usuarioId = usuarioRes.rows[0].id;

    await client.query(
      "INSERT INTO resultados (usuario_id, pontuacao) VALUES ($1, $2)",
      [usuarioId, acertos]
    );
    await client.query("COMMIT");

    console.log(`\n ${nome}, você acertou ${acertos}/${perguntas.length} perguntas.\n`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro durante o quiz:", (err as Error).message);
  } finally {
    client.release();
  }
}

// --- CONSULTAR USUÁRIOS E RESULTADOS ---
async function listarUsuarios(): Promise<void> {
  const res = await pool.query(
    `SELECT u.id, u.nome, r.pontuacao, r.criado_em
     FROM usuarios u
     JOIN resultados r ON r.usuario_id = u.id
     ORDER BY u.id`
  );

  console.log("\n=== Usuários e Pontuações ===");
  if (res.rowCount === 0) {
    console.log("Nenhum usuário registrado ainda.");
    return;
  }

  res.rows.forEach((row) => {
    console.log(
      `ID: ${row.id} | Nome: ${row.nome} | Pontuação: ${row.pontuacao} | Data: ${new Date(
        row.criado_em
      ).toLocaleString()}`
    );
  });
}

// --- MENU PRINCIPAL ---
async function menu(): Promise<void> {
  while (true) {
    console.log("\n=== MENU ===");
    console.log("1) Cadastrar pergunta");
    console.log("2) Executar quiz");
    console.log("3) Listar usuários e pontuações");
    console.log("0) Sair");

    const opcao = readlineSync.questionInt("Escolha uma opção: ");
    if (opcao === 1) await cadastrarPergunta();
    else if (opcao === 2) await executarQuiz();
    else if (opcao === 3) await listarUsuarios();
    else if (opcao === 0) break;
    else console.log("Opção inválida.");
  }

  await pool.end();
  console.log("Conexão encerrada.");
}

menu();
