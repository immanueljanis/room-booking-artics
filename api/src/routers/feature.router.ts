import { Router } from "express";
import { createFeature, deleteFeature, getFeatures } from "../controllers/feature.controller";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @openapi
 * /api/features:
 *   get:
 *     summary: Get semua features
 *     tags:
 *       - Features
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Nomor halaman (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Jumlah data per halaman (optional)
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, active, created_at, updated_at]
 *           example: created_at
 *         description: Kolom untuk sorting (optional)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: DESC
 *         description: Urutan sorting (optional)
 *       - in: query
 *         name: active
 *         schema:
 *           type: number
 *           example: 1
 *         description: Filter berdasarkan active (optional)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Elektronik"
 *         description: Filter berdasarkan nama (optional)
 *     responses:
 *       '200':
 *         description: Daftar fitur berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: List features fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feature'
 *       '401':
 *         description: Unauthorized – JWT missing atau tidak valid
 */
router.get("/", authenticate, authorize("super_admin", "admin"), getFeatures);

/**
 * @openapi
 * /api/features:
 *   post:
 *     summary: Admin dapat membuat features
 *     tags:
 *       - Features
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Projector"
 *     responses:
 *       '201':
 *         description: Feature berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Feature created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Projector"
 *       '400':
 *         description: Bad Request – missing or invalid `name`
 *       '401':
 *         description: Unauthorized – JWT missing or invalid
 *       '403':
 *         description: Forbidden – hanya Super Admin atau Admin
 */
router.post("/", authenticate, authorize("super_admin", "admin"), createFeature);

/**
 * @openapi
 * /api/features/{id}:
 *   delete:
 *     summary: Delete fitur
 *     tags:
 *       - Features
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: ID fitur yang ingin dihapus
 *     responses:
 *       '200':
 *         description: Feature berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Feature deleted
 *                 data:
 *                   type: object
 *                   example: {} 
 *       '401':
 *         description: Unauthorized – JWT missing atau tidak valid
 *       '403':
 *         description: Forbidden – hanya Super Admin / Admin
 *       '404':
 *         description: Feature tidak ditemukan
 */
router.delete("/:id", authenticate, authorize("super_admin", "admin"), deleteFeature);

export default router;