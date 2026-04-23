import express from 'express';
import { PrismaClient } from '@prisma/client';
import stripePackage from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import { Eureka } from 'eureka-js-client';
import pkg from 'pg';
const { Pool } = pkg; // ✅ pg module එක ඇතුළෙන් Pool එක ගන්නවා
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const PORT = 8083;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY);const app = express();



// ✅ 2. Eureka Configuration & Registration
const eurekaClient = new Eureka({
    instance: {
        app: 'enrollment-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${PORT}`,
        port: {
            '$': PORT,
            '@enabled': 'true',
        },
        vipAddress: 'enrollment-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

eurekaClient.start((error) => {
    if (error) {
        console.error('❌ Eureka Registration Failed:', error);
    } else {
        console.log('✅ Enrollment Service Registered with Eureka!');
    }
});

// ✅ 3. Stripe Webhook (Must be before express.json())
app.post('/api/enroll/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`❌ Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            await prisma.enrollment.update({
                where: { transactionId: session.id },
                data: { status: 'SUCCESS' }
            });
            console.log(`✨ Enrollment marked as SUCCESS for: ${session.id}`);
        } catch (dbError) {
            console.error('❌ DB Update Error:', dbError);
        }
    }
    res.json({ received: true });
});

app.use(express.json());

// ✅ 4. Create Checkout Session
app.post('/api/enroll/checkout', async (req, res) => {
    const { courseId, studentId, amount, courseName } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'lkr',
                    product_data: { name: courseName },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:4200/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:4200/payment-failed`,
        });

        await prisma.enrollment.create({
            data: {
                studentId: Number(studentId),
                courseId: Number(courseId),
                amount: Number(amount),
                transactionId: session.id,
                status: 'PENDING'
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('❌ Checkout Error:', error);
        res.status(500).json({ error: "Stripe error" });
    }
});

// ✅ 5. Check Enrollment Status
app.get('/api/enroll/check/:studentId/:courseId', async (req, res) => {
    const { studentId, courseId } = req.params;
    try {
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                studentId: Number(studentId),
                courseId: Number(courseId),
                status: 'SUCCESS'
            }
        });
        res.json({ enrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ error: "Check error" });
    }
});

// ✅ 6. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Enrollment Service running on port ${PORT}`);
});