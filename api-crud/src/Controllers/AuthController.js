const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();
const generateToken = (user = {}) => {
  return jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400
    }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    // Verifica se o email já existe na base de dados
    if (await UserModel.findOne({ email })) {
      return res
        .status(400)
        .json({ error: true, message: "Email already exists" });
    }

    // Cria o novo usuário
    const User = await UserModel.create(req.body);
    User.password = undefined;
    // Retorna sucesso
    return res.json({
      error: false,
      mensagem: "Registrado com sucesso",
      dados: User,
      jwt: generateToken(User)
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    // Trata o erro de email duplicado
    if (error.message && error.message.includes("duplicate key error")) {
      return res
        .status(400)
        .json({ error: true, message: "Email já está sendo usado" });
    }

    // Retorna erro genérico para outros casos
    return res.status(500).json({
      error: true,
      message: "Erro interno no servidor! " + error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Encontra o usuário pelo email
    const user = await UserModel.findOne({ email }).select("+password"); // Exclui o campo 'password' da consulta
    // Verifica se o usuário foi encontrado
    if (!user) {
      return res
        .status(401)
        .json({ error: true, message: "Usuário não encontrado" });
    }
    // Compara a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: "Senha incorreta" });
    }
    user.password = undefined;
    // Retorna o usuário sem a senha, após a verificação
    return res.status(200).json({
      error: false,
      message: "Login bem-sucedido",
      token: generateToken(user)
    });
  } catch (error) {
    console.error("Erro ao realizar o login:", error);
    return res.status(500).json({
      error: true,
      message:
        "Erro interno no servidor, tente novamente dentro de alguns minutos"
    });
  }
});

module.exports = router;
