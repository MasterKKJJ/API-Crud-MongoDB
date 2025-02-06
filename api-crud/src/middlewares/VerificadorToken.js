const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

module.exports = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    console.log(token);
    return next();
  }
  if (token && token.startsWith("Bearer ")) {
    // Remove a palavra "Bearer" da string
    token = token.split(" ")[1];
  }

  if (!token) {
    console.log(token);
    return next();
  }

  // Verificando e decodificando o token
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica a assinatura do JWT
  const { id } = decoded;

  // Encontrando o usuário no banco de dados
  console.log(token);
  const user = await UserModel.findById(id).select("-password");
  if (!user) {
    return res.send("Não logado");
  }

  req.user = user;
  return next();
};
