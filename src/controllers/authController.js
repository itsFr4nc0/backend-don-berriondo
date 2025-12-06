import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readDB, writeDB } from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export const register = (req, res) => {
  const { name, email, password, city, postalCode, address, birthDate, gender } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: "Faltan datos" });

  const db = readDB();
  if (db.users.some(u => u.email === email)) {
    return res.status(409).json({ message: "Correo ya registrado" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    city,
    postalCode,
    address,
    birthDate,
    gender
  };
  db.users.push(newUser);
  writeDB(db);

  // No devolver hash
  const { passwordHash: _h, ...userSafe } = newUser;
  return res.status(201).json({ user: userSafe });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  // Soportar ambos formatos: passwordHash (bcrypt) o password (texto plano)
  let match = false;

  if (user.passwordHash) {
    // Si existe passwordHash (usuarios nuevos creados con bcrypt)
    match = bcrypt.compareSync(password, user.passwordHash);
  } else if (user.password) {
    // Si existe password en claro (tu admin actual en db.json)
    match = password === user.password;
  }

  if (!match)
    return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRES_IN || "7d",
    }
  );

  const { passwordHash, ...userSafe } = user;
  return res.json({ token, user: userSafe });
};
