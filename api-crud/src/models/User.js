const mongoose = require("../database");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email já está sendo usado"],
      lowercase: true, // Para evitar duplicação por letras maiúsculas/minúsculas
      trim: true,
      validate: {
        validator: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Formato de email inválido"
      }
    },
    password: {
      type: String,
      required: true,
      select: false // Evita que a senha seja retornada por padrão
    }
  },
  { timestamps: true }
);

// Antes de salvar, criptografa a senha
// com a arrow function ele dá erro ! entao tem que criar uma função mesmo :D
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
