const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../models/user.model');

const router = express.Router();
const SECRET_KEY = 'chave-secreta';

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Erro ao gerar hash');
    createUser(email, hash, (err) => {
      if (err) return res.status(400).send('Usuário já existe');
      res.status(201).send('Usuário criado com sucesso');
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  findUserByEmail(email, (err, user) => {
    if (err || !user) return res.status(401).send('Credenciais inválidas');
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).send('Senha incorreta');
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h'
      });
      res.json({ token });
    });
  });
});

module.exports = router;
