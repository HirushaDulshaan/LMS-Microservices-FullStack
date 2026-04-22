import express from 'express';
import { PrismaClient } from '@prisma/client';
import stripePackage from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// 1. Checkout Session එකක් හදන Endpoint එක
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
            success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/payment-failed`,
        });

        // Database එකේ Record එකක් හදනවා
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
        console.error(error);
        res.status(500).json({ error: "Stripe error" });
    }
});

const PORT = 8083;
app.listen(PORT, () => console.log(`Enrollment Service running on port ${PORT}`));