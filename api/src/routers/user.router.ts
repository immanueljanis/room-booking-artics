import { Router } from "express";
import { userLoginRules, userRegisterRules } from "../validators/user";
import { validateRequest } from "../middlewares/validateRequest";
import { loginUser, registerUser } from "../controllers/user.controller";

const router = Router();

router.post("/register", userRegisterRules, validateRequest, registerUser);
router.post("/login", userLoginRules, validateRequest, loginUser)

export default router