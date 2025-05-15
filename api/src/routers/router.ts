import { Router } from "express";
import adminRouter from "./admin.router";

const router = Router();

router.use("/api/admin", adminRouter);

export default router;