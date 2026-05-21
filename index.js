const express = require('express');
const app = express();
const PORT = 3000;
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());

app.get('/', (req, res) => {
    const sql ="SELECT * FROM usuarios";
    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json({ data: rows });
    });
});

app.post('/usuarios', (req, res) => {
    const {nome, email} = req.body;
    const sql = `INSERT INTO usuarios (nome, email) VALUES (?,?)`;

    db.run(sql, [nome, email], function(err) {
        if (err) {
            return res.status(400).json({ erro: err.message });
        }
        res.json({id: this.lastID, mensagem: "Usuarios cadastrado!"});
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const db = new sqlite3.Database('./meubanco.db', (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
    } else {
        console.log("Conectando ao banco de dados SQLite!");
    }
});

const sql = `CREATE TABLE IF NOT EXISTS usuarios (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXTO NOT NULL,
email TEXT UNIQUE NOT NULL
)`;

db.run(sql, (err) => {
    if (err) console.error("Erro ao criar tabela:", err.message);
    else console.log("tabela 'usuarios' pronta para uso!");
});
