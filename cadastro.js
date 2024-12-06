const express = require('express');
const mysql = require('mysql2');  // Conexão com o MySQL

// Criando a aplicação Express
const app = express();
const port = 3000;

// Middleware para processar o corpo da requisição como JSON
app.use(express.json());

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',  // Nome do servidor MySQL
  user: 'root',       // Seu usuário do MySQL
  password: 'senha',  // Sua senha do MySQL
  database: 'livraria',  // Nome do banco de dados
});

// Conectar ao banco de dados MySQL
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota POST para cadastrar um novo livro
app.post('/livros', (req, res) => {
  const { titulo, autor, genero } = req.body;

  if (!titulo || !autor || !genero) {
    return res.status(400).json({ error: 'Título, autor e gênero são obrigatórios.' });
  }

  const sql = 'INSERT INTO livros (titulo, autor, genero) VALUES (?, ?, ?)';
  
  db.execute(sql, [titulo, autor, genero], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar o livro:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar o livro.' });
    }

    res.status(201).json({
      id: result.insertId,
      titulo,
      autor,
      genero,
    });
  });
});

// Rota GET para listar todos os livros
app.get('/livros', (req, res) => {
  const sql = 'SELECT * FROM livros';
  
  db.execute(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }

    res.status(200).json(results);  // Retorna todos os livros cadastrados
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API da livraria rodando em http://localhost:${port}`);
});



