import { readDB } from "../utils/db.js";

export const getProducts = (req, res) => {
  const db = readDB();
  res.json(db.products);
};

export const getProductById = (req, res) => {
  const id = Number(req.params.id);
  const db = readDB();
  const product = db.products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });
  res.json(product);
};
