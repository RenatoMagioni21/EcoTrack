const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração para ler dados de formulários e JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve os arquivos estáticos da pasta 'public' (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o Banco de Dados MySQL no XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Usuário padrão do XAMPP
    password: '', // Senha padrão do XAMPP (vazia)
    database: 'ecotrack'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL (XAMPP) com sucesso!');
});

// ROTA 1: Cadastro de Usuário
app.post('/api/registrar', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    
    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
            }
            return res.status(500).json({ error: 'Erro ao registrar usuário.' });
        }
        res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
    });
});

// ROTA 2: Login de Usuário
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT id, nome, senha FROM usuarios WHERE email = ?';

    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor.' });
        
        if (results.length > 0 && results[0].senha === senha) {
            // Retorna os dados básicos do usuário (Simulação de sessão no Front-end)
            res.status(200).json({ 
                id: results[0].id, 
                nome: results[0].nome, 
                message: 'Login bem-sucedido!' 
            });
        } else {
            res.status(401).json({ error: 'E-mail ou senha incorretos!' });
        }
    });
});

// ROTA 3: Salvar Cálculo no Histórico (RF04)
app.post('/api/historico', (req, res) => {
    const { usuario_id, km_rodados, energia_kwh, total_co2, nivel } = req.body;
    const sql = 'INSERT INTO historico_calculos (usuario_id, km_rodados, energia_kwh, total_co2, nivel) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [usuario_id, km_rodados, energia_kwh, total_co2, nivel], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar no histórico.' });
        res.status(201).json({ message: 'Cálculo salvo no histórico!' });
    });
});

// ROTA 4: Buscar Histórico do Usuário para listar na tela
app.get('/api/historico/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId;
    // Busca os cálculos trazendo os mais recentes primeiro
    const sql = 'SELECT km_rodados, energia_kwh, total_co2, nivel, DATE_FORMAT(calculado_em, "%d/%m/%Y %H:%i") as data FROM historico_calculos WHERE usuario_id = ? ORDER BY calculado_em DESC';

    db.query(sql, [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar histórico.' });
        res.status(200).json(results);
    });
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});