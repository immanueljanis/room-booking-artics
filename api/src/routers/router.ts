import { Router } from "express";
import adminRouter from "./admin.router";
import featureRouter from "./feature.router"
import authRouter from "./auth.router"
import userRouter from "./user.router"

const router = Router();

router.use("/api/admin", adminRouter);
router.use("/api/features", featureRouter);
router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);

export default router;