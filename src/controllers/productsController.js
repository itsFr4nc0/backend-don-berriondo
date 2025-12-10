import { readDB, writeDB } from "../utils/db.js";

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

/* ------------------- NUEVO ------------------- */
export const addProduct = (req, res) => {
  const { nombre, categoria, descripcion, precio, imagen, stock } = req.body;

  if (!nombre || !categoria || !descripcion || !precio || !imagen || !stock) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const db = readDB();
  const newProduct = {
    id: db.products.length ? db.products[db.products.length - 1].id + 1 : 1,
    nombre,
    categoria,
    descripcion,
    precio: Number(precio),
    imagen,
    stock: Number(stock)
  };

  db.products.push(newProduct);
  writeDB(db);

  res.status(201).json({ message: "Producto agregado", product: newProduct });
};
/* ---------------------------------------------- */

export const updateStock = (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Formato inválido" });
  }

  try {
    const db = readDB();

    items.forEach((item) => {
      const producto = db.products.find(p => p.id === item.id);
      if (producto) {
        producto.stock = Math.max(producto.stock - item.cantidad, 0);
      }
    });

    writeDB(db);

    res.json({ message: "Stock actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando stock:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
