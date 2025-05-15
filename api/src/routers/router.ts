import { Router } from "express"
import AuthRouter from "./auth.router"

const router = Router()
router.use('/api/auth', AuthRouter)

export default router