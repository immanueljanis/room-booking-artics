import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/whoami", authenticate, AuthController.whoAmI);
router.post("/logout", authenticate, AuthController.logout);

export default router