import express from "express";
import { getProducts, getProductById, updateStock, addProduct } from "../controllers/productsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

/* -------- NUEVO: AGREGAR PRODUCTO (PROTEGIDO) -------- */
router.post("/", authMiddleware, addProduct);

router.post("/update-stock", updateStock);

export default router;
