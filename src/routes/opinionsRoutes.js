import express from "express";
import { 
  getOpinions, 
  getOpinionsByProduct, 
  createOpinion,
  canReview 
} from "../controllers/opinionsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Rutas públicas
router.get("/", getOpinions);
router.get("/product/:productId", getOpinionsByProduct);

// Rutas protegidas
router.post("/", authMiddleware, createOpinion);
router.get("/can-review/:productId", authMiddleware, canReview);

export default router;