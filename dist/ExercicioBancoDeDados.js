"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/quiz.ts
var pg_1 = require("pg");
var readlineSync = require("readline-sync");
// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
var pool = new pg_1.Pool({
    user: "aluno",
    host: "localhost",
    database: "db_profedu",
    password: "102030",
    port: 5432,
});
// --- FUNÇÃO PARA CADASTRAR PERGUNTAS ---
function cadastrarPergunta() {
    return __awaiter(this, void 0, void 0, function () {
        var texto, alternativas, i, textoAlt, correta, client, res, perguntaId, _i, alternativas_1, alt, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    texto = readlineSync.question("Digite o texto da pergunta: ");
                    if (!texto.trim()) {
                        console.log("Texto inválido. Operação cancelada.");
                        return [2 /*return*/];
                    }
                    alternativas = [];
                    console.log("Cadastre as 3 alternativas:");
                    for (i = 1; i <= 3; i++) {
                        textoAlt = readlineSync.question("Alternativa ".concat(i, ": "));
                        alternativas.push({ texto: textoAlt, correta: false });
                    }
                    correta = readlineSync.questionInt("Qual alternativa é a correta? (1, 2 ou 3): ");
                    while (![1, 2, 3].includes(correta)) {
                        correta = readlineSync.questionInt("Digite 1, 2 ou 3 para indicar a correta: ");
                    }
                    alternativas[correta - 1].correta = true;
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 10, 12, 13]);
                    return [4 /*yield*/, client.query("BEGIN")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client.query("INSERT INTO perguntas (texto) VALUES ($1) RETURNING id", [texto])];
                case 4:
                    res = _a.sent();
                    perguntaId = res.rows[0].id;
                    _i = 0, alternativas_1 = alternativas;
                    _a.label = 5;
                case 5:
                    if (!(_i < alternativas_1.length)) return [3 /*break*/, 8];
                    alt = alternativas_1[_i];
                    return [4 /*yield*/, client.query("INSERT INTO alternativas (pergunta_id, texto, correta) VALUES ($1, $2, $3)", [perguntaId, alt.texto, alt.correta])];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, client.query("COMMIT")];
                case 9:
                    _a.sent();
                    console.log("Pergunta cadastrada com sucesso!");
                    return [3 /*break*/, 13];
                case 10:
                    err_1 = _a.sent();
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 11:
                    _a.sent();
                    console.error("Erro ao cadastrar pergunta:", err_1.message);
                    return [3 /*break*/, 13];
                case 12:
                    client.release();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// --- FUNÇÃO PARA EXECUTAR O QUIZ ---
function executarQuiz() {
    return __awaiter(this, void 0, void 0, function () {
        var perguntasRes, perguntas, acertos, client, _i, perguntas_1, p, escolha, alternativaEscolhida, verif, nome, usuarioRes, usuarioId, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.query("SELECT p.id, p.texto, \n            json_agg(json_build_object('id', a.id, 'texto', a.texto)) AS alternativas\n     FROM perguntas p\n     JOIN alternativas a ON a.pergunta_id = p.id\n     GROUP BY p.id\n     ORDER BY p.id")];
                case 1:
                    perguntasRes = _a.sent();
                    perguntas = perguntasRes.rows;
                    if (perguntas.length === 0) {
                        console.log("Nenhuma pergunta cadastrada.");
                        return [2 /*return*/];
                    }
                    console.log("\n--- Iniciando o quiz (".concat(perguntas.length, " perguntas) ---\n"));
                    acertos = 0;
                    return [4 /*yield*/, pool.connect()];
                case 2:
                    client = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 12, 14, 15]);
                    _i = 0, perguntas_1 = perguntas;
                    _a.label = 4;
                case 4:
                    if (!(_i < perguntas_1.length)) return [3 /*break*/, 7];
                    p = perguntas_1[_i];
                    console.log("Pergunta ".concat(p.id, ": ").concat(p.texto));
                    p.alternativas.forEach(function (a, i) {
                        return console.log("  ".concat(i + 1, ") ").concat(a.texto));
                    });
                    escolha = readlineSync.questionInt("Escolha (1, 2 ou 3): ");
                    while (![1, 2, 3].includes(escolha)) {
                        escolha = readlineSync.questionInt("Escolha inválida. Digite 1, 2 ou 3: ");
                    }
                    alternativaEscolhida = p.alternativas[escolha - 1];
                    return [4 /*yield*/, client.query("SELECT correta FROM alternativas WHERE id = $1", [alternativaEscolhida.id])];
                case 5:
                    verif = _a.sent();
                    if (verif.rows[0].correta) {
                        acertos++;
                    }
                    console.log("");
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    nome = readlineSync.question("Digite seu nome: ");
                    if (!nome.trim()) {
                        console.log("Nome inválido. Resultado não salvo.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, client.query("BEGIN")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, client.query("INSERT INTO usuarios (nome) VALUES ($1) RETURNING id", [nome])];
                case 9:
                    usuarioRes = _a.sent();
                    usuarioId = usuarioRes.rows[0].id;
                    return [4 /*yield*/, client.query("INSERT INTO resultados (usuario_id, pontuacao) VALUES ($1, $2)", [usuarioId, acertos])];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, client.query("COMMIT")];
                case 11:
                    _a.sent();
                    console.log("\n ".concat(nome, ", voc\u00EA acertou ").concat(acertos, "/").concat(perguntas.length, " perguntas.\n"));
                    return [3 /*break*/, 15];
                case 12:
                    err_2 = _a.sent();
                    return [4 /*yield*/, client.query("ROLLBACK")];
                case 13:
                    _a.sent();
                    console.error("Erro durante o quiz:", err_2.message);
                    return [3 /*break*/, 15];
                case 14:
                    client.release();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// --- CONSULTAR USUÁRIOS E RESULTADOS ---
function listarUsuarios() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.query("SELECT u.id, u.nome, r.pontuacao, r.criado_em\n     FROM usuarios u\n     JOIN resultados r ON r.usuario_id = u.id\n     ORDER BY u.id")];
                case 1:
                    res = _a.sent();
                    console.log("\n=== Usuários e Pontuações ===");
                    if (res.rowCount === 0) {
                        console.log("Nenhum usuário registrado ainda.");
                        return [2 /*return*/];
                    }
                    res.rows.forEach(function (row) {
                        console.log("ID: ".concat(row.id, " | Nome: ").concat(row.nome, " | Pontua\u00E7\u00E3o: ").concat(row.pontuacao, " | Data: ").concat(new Date(row.criado_em).toLocaleString()));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// --- MENU PRINCIPAL ---
function menu() {
    return __awaiter(this, void 0, void 0, function () {
        var opcao;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 8];
                    console.log("\n=== MENU ===");
                    console.log("1) Cadastrar pergunta");
                    console.log("2) Executar quiz");
                    console.log("3) Listar usuários e pontuações");
                    console.log("0) Sair");
                    opcao = readlineSync.questionInt("Escolha uma opção: ");
                    if (!(opcao === 1)) return [3 /*break*/, 2];
                    return [4 /*yield*/, cadastrarPergunta()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2:
                    if (!(opcao === 2)) return [3 /*break*/, 4];
                    return [4 /*yield*/, executarQuiz()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    if (!(opcao === 3)) return [3 /*break*/, 6];
                    return [4 /*yield*/, listarUsuarios()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    if (opcao === 0)
                        return [3 /*break*/, 8];
                    else
                        console.log("Opção inválida.");
                    _a.label = 7;
                case 7: return [3 /*break*/, 0];
                case 8: return [4 /*yield*/, pool.end()];
                case 9:
                    _a.sent();
                    console.log("Conexão encerrada.");
                    return [2 /*return*/];
            }
        });
    });
}
menu();
