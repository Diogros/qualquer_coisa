const express = require('express');
const app = express();
const PORT = 3000;
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("servidor ativo e operante!");
});

app.get('/usuarios', (req, res) => {
    const sql ="SELECT * FROM usuarios";
    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json({ data: rows });
    });
});

app.put('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const { nome, email } = req.body;
    const sql = `UPDATE usuarios SET nome = ?, email = ? WHERE id = ?`;

    db.run(sql, [nome, email, id], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ mensagem: "Atualizado com sucesso!", alteracoes: this.changes });
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

async function cadastrar(dados) {
    const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (response.ok) {
        const result = await response.json();
        alert(`Sucesso! Usuario ID ${result.id} cadastrado.`);
    } else {
        alert("Erro no cadastro");
    }
}

async function carregarUsuarios() {
    const response = await fetch('http://localhost:3000/usuarios');
    const { data } = await response.json();
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    dataforEach(user => {
        const item = document.createElement('li');
        item.textContent = `${user.nome} - ${user.email}`;
        lista.appendChild(item);
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = async () => {
            await fetch(`http://localhost:3000/usuarios/${user.id}`, { method: 'DELETE' });
            carregarUsuarios();
        };
        item.appendChild(btnExcluir);
    });
}
window.onload = carregarUsuarios;

app.delete('/usuarios/:id', (req, res) => {
    const id =req.params.id;
    const sql = `DELETE FROM usuarios WHERE id = ?`;

    db.run(sql, [id], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ mensagem: "Removido!", linhasAfetadas: this.changes });
    });
});

let idEdicao = null;

function prepararEdicao(user) {
    document.getElementById('nome').value = user.nome;
    document.getElementById('email').value = user.email;
    idEdicao = user.id;
}

if (idEdicao) {

} else {

}
try {
    const res = await fetch('...');
    if (!res.ok) throw new Error("Falha na comunicação");
        
} catch (err) {
    console.error("Erro capturado", erro.message);
    alert("Não foi possivel conectar ao servidor");
}