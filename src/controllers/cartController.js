import { readDB, writeDB } from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

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
  const { items } = req.body; // Recibir items del frontend
  const db = readDB();
  
  // Priorizar items del body, sino buscar en DB
  let cartItems = items;
  
  if (!cartItems || cartItems.length === 0) {
    const cart = db.carts.find(c => c.userId === userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Carrito vacío" });
    }
    cartItems = cart.items;
  }
  
  // Usar cartItems en lugar de cart.items
  const cart = { items: cartItems };

  // Inicializar purchases si no existe
  if (!db.purchases) db.purchases = [];
  
  // Registrar la compra con validación de campos
  const purchase = {
    id: uuidv4(),
    userId,
    items: cart.items.map(item => ({
      id: item.id,
      name: item.nombre || item.name, // Tu frontend usa "nombre"
      cantidad: item.cantidad,
      precio: item.precio || item.price
    })),
    fecha: new Date().toISOString(),
    total: cart.items.reduce((sum, item) => {
      const precio = item.precio || item.price || 0;
      return sum + (precio * item.cantidad);
    }, 0)
  };
  
  console.log("✅ Compra registrada:", purchase);
  
  db.purchases.push(purchase);
  
  // Vaciar el carrito
  db.carts = db.carts.filter(c => c.userId !== userId);
  
  writeDB(db);
  
  res.json({ 
    message: "Compra realizada exitosamente",
    purchase 
  });
};