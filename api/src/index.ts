import express, { Express, Request, Response } from "express"
import dotenv from 'dotenv';
import router from "./routers/router";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./helpers/responseHandler";
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(cookieParser())
app.use(router)

app.use('/health-check', (req: Request, res: Response) => {
    const uptimeSeconds = Math.floor(process.uptime());
    const now = new Date();

    let dtJakarta = now.toLocaleString('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    dtJakarta = dtJakarta.replace(',', '');

    res.status(200).json({
        msg: "Website Room Booking",
        data: {
            status: "Health Check Success",
            uptime: `${uptimeSeconds} second`,
            dateTime: dtJakarta,
            timeZone: {
                zone: "Asia/Jakarta",
                timestamp: now.getTime()
            }
        }
    });
})

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))

app.use(errorHandler)
app.listen(port, () => {
    console.log(`[SERVER] running at port ${port}`)
})