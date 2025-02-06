const express = require("express");
require("dotenv").config();
const AuthController = require("./Controllers/AuthController");
const AdminController = require("./Controllers/AdminController");
const Autenticate = require("./middlewares/Autenticate");

const app = express();
app.use(express.json());

app.use("/user", AuthController);
app.use("/admin", Autenticate, AdminController);

app.get("/", (req, res) => {
  return res.json({
    error: false,
    mensagem: "Acesso bem sucedido!"
  });
});

app.listen(process.env.PORT_API_SERVER, () => {
  console.log(
    "Servidor está rodando em: https://localhost" + process.env.PORT_API_SERVER
  );
});
