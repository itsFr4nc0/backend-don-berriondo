import express from "express";
import { 
  getProducts, 
  getProductById, 
  updateStock, 
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Rutas públicas
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/update-stock", updateStock);

// Rutas protegidas (solo admin)
router.post("/", authMiddleware, addProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;