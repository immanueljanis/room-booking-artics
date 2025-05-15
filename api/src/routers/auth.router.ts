import express, { Router } from "express"
import * as AuthController from "../controllers/auth.controller"

const router: Router = express.Router()

/**
 * @openapi
 * /api/auth/registerAdmin:
 *   post:
 *     summary: Register admin baru
 *     tags:
 *       - Auth
 *     parameters: []                                      # ← explicitly no parameters
 *     description: "Endpoint untuk mendaftarkan akun admin baru (akses: Super Admin)"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: AdminUser
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ssw0rd
 *     responses:
 *       '201':
 *         description: Admin berhasil didaftarkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Validation error (bad request)
 *       '401':
 *         description: Unauthorized – hanya Super Admin
 *       '409':
 *         description: Conflict – email sudah terdaftar
 */
router.post("/registerAdmin", AuthController.registerAdmin)

export default router