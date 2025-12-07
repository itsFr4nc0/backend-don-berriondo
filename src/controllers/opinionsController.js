import { readDB, writeDB } from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";

export const getOpinions = (req, res) => {
  const db = readDB();
  res.json(db.opinions || []);
};

export const getOpinionsByProduct = (req, res) => {
  const productId = Number(req.params.productId);
  const db = readDB();
  const opinions = (db.opinions || []).filter(op => op.productId === productId);
  res.json(opinions);
};

export const createOpinion = (req, res) => {
  const userId = req.user.id;
  const { productId, comentario, estrellas } = req.body;

  if (!productId || !comentario || !estrellas) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  if (estrellas < 1 || estrellas > 5) {
    return res.status(400).json({ message: "Las estrellas deben estar entre 1 y 5" });
  }

  const db = readDB();

  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  const userPurchases = db.purchases || [];
  const hasPurchased = userPurchases.some(purchase => 
    purchase.userId === userId && 
    purchase.items.some(item => item.id === productId)
  );

  if (!hasPurchased) {
    return res.status(403).json({ 
      message: "Solo puedes opinar sobre productos que has comprado" 
    });
  }

  const opinions = db.opinions || [];
  const alreadyReviewed = opinions.some(
    op => op.userId === userId && op.productId === productId
  );

  if (alreadyReviewed) {
    return res.status(409).json({ 
      message: "Ya has enviado una opinión para este producto" 
    });
  }

  const newOpinion = {
    id: uuidv4(),
    userId,
    productId,
    nombre: req.user.name,
    producto: product.name,
    comentario,
    estrellas,
    fecha: new Date().toISOString()
  };

  if (!db.opinions) db.opinions = [];
  db.opinions.push(newOpinion);
  writeDB(db);

  res.status(201).json(newOpinion);
};

export const canReview = (req, res) => {
  const userId = req.user.id;
  const productId = Number(req.params.productId);

  const db = readDB();

  const userPurchases = db.purchases || [];
  const hasPurchased = userPurchases.some(purchase => 
    purchase.userId === userId && 
    purchase.items.some(item => item.id === productId)
  );

  const opinions = db.opinions || [];
  const alreadyReviewed = opinions.some(
    op => op.userId === userId && op.productId === productId
  );

  res.json({ 
    canReview: hasPurchased && !alreadyReviewed,
    hasPurchased,
    alreadyReviewed
  });
};