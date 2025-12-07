import express from "express";
import { getProducts, getProductById, updateStock } from "../controllers/productsController.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/update-stock", updateStock);

export default router;
