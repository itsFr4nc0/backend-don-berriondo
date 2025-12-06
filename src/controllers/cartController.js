import { readDB, writeDB } from "../utils/db.js";

export const getCart = (req, res) => {
  const userId = req.user.id;
  const db = readDB();
  const bucket = db.carts.find(c => c.userId === userId) || { userId, items: [] };
  res.json(bucket);
};

export const updateCart = (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;
  const db = readDB();
  let cart = db.carts.find(c => c.userId === userId);
  if (!cart) {
    cart = { userId, items: items || [] };
    db.carts.push(cart);
  } else {
    cart.items = items || [];
  }
  writeDB(db);
  res.json(cart);
};

export const clearCart = (req, res) => {
  const userId = req.user.id;
  const db = readDB();
  db.carts = db.carts.filter(c => c.userId !== userId);
  writeDB(db);
  res.json({ message: "Carrito vaciado" });
};

export const checkout = (req, res) => {
  const userId = req.user.id;
  const db = readDB();
  db.carts = db.carts.filter(c => c.userId !== userId);
  writeDB(db);
  res.json({ message: "Compra simulada exitosa" });
};
