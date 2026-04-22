const { PrismaClient } = require('@prisma/client');
// Oya output path ekak dapu nisa ekenma import karanna
const { Enrollment } = require('./src/generated/prisma');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});