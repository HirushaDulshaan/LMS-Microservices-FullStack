const { PrismaClient } = require('@prisma/client');
const { Enrollment } = require('./src/generated/prisma');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});