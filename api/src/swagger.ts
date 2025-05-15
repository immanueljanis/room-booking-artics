import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import path = require('path');

dotenv.config()

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Meeting Room Booking API',
            version: '1.0.0',
            description: 'API docs for your Meeting Room Booking service',
        },
        servers: [
            { url: `http://localhost:${process.env.PORT}`, description: 'Local server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                AuthResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', enum: ['success', 'error'] },
                        message: { type: 'string' },
                        data: { $ref: '#/components/schemas/User' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' }
                    }
                }
            }
        }
    },
    apis: [
        path.resolve(__dirname, 'routers/**/*.ts'),
        path.resolve(__dirname, 'controllers/**/*.ts'),
    ],
};

export const swaggerSpec = swaggerJSDoc(options);