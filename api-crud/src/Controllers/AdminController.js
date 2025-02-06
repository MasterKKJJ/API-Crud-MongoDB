const express = require("express");

const UserModel = require("../models/User");
const router = express.Router();

async function pegarUsuarios() {
  try {
    // Buscando todos os usuários na coleção
    const users = await UserModel.find();

    // Retorna os usuários encontrados
    return users;
  } catch (error) {
    // Em caso de erro, exibe o erro e retorna um array vazio
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

router.get("/users", async (req, res) => {
  return res.send(await pegarUsuarios());
});
module.exports = router;
