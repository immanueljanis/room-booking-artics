import { Router } from "express";
import { registerAdmin, loginAdmin } from "../controllers/admin.controller";
import { adminRegisterRules } from "../validators/admin/registerRules";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();

/**
 * @openapi
 * /api/admin/register:
 *   post:
 *     summary: Register admin baru
 *     tags:
 *       - Admin
 *     parameters: []
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
 *               $ref: '#/components/schemas/AdminRegister'
 *       '400':
 *         description: Validation error – email sudah terdaftar
 *       '401':
 *         description: Unauthorized – hanya Super Admin
 */
router.post("/register", adminRegisterRules, validateRequest, registerAdmin);

/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     summary: Login admin dan generate JWT
 *     tags:
 *       - Admin
 *     description: >
 *       Endpoint untuk autentikasi Super Admin atau Admin.
 *       Mengembalikan JSON Web Token (JWT) dan data admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssw0rd123
 *     responses:
 *       '200':
 *         description: Login berhasil, mengembalikan token dan data admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLogin'
 *       '400':
 *         description: Bad Request — payload tidak valid
 *       '401':
 *         description: Unauthorized — email atau password salah
 *       '500':
 *         description: Internal Server Error
 */
router.post("/login", loginAdmin)

export default router;