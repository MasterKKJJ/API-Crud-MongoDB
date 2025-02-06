const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // Verificando se o header Authorization está presente
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ message: "Token não fornecido!" });
    }

    if (token && token.startsWith("Bearer ")) {
      // Remove a palavra "Bearer" da string
      token = token.split(" ")[1];
    }

    if (!token) {
      return res
        .status(400)
        .json({ error: true, message: "Token mal formado!" });
    }

    // Verificando e decodificando o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica a assinatura do JWT
    const { id } = decoded;

    // Encontrando o usuário no banco de dados
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ error: true, message: "Usuário não encontrado!" });
    }

    // Checando se o usuário é o autorizado
    if (user.name === "MasterKKJJ" && user.email === "master@master.com") {
      // Acesso autorizado, passando para o próximo middleware
      return next();
    } else {
      return res.status(401).json({ erro: true, message: "Unauthorized!" });
    }
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return res.status(500).json({ erro: true, message: "Erro no servidor!" });
  }
};
