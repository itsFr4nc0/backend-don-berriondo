import express from "express";
import { getCart, updateCart, clearCart, checkout } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.use(authMiddleware);
router.get("/", getCart);
router.post("/", updateCart);
router.delete("/", clearCart);
router.post("/checkout", checkout);

export default router;
