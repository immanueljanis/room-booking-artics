import { Router } from "express";
import adminRouter from "./admin.router";
import featureRouter from "./feature.router"

const router = Router();

router.use("/api/admin", adminRouter);
router.use("/api/features", featureRouter);

export default router;