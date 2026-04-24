import express from 'express';
import {PrismaClient} from '@prisma/client';
import stripePackage from 'stripe';
import dotenv from 'dotenv';
import axios from 'axios';
import {Eureka} from 'eureka-js-client';
import pkg from 'pg';
import {PrismaPg} from '@prisma/adapter-pg';

const {Pool} = pkg;
dotenv.config();
const PORT = 8083;

const pool = new Pool({connectionString: process.env.DATABASE_URL});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});
const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY);
const app = express();

// ✅ 1. Stripe Webhook (MUST be before express.json)
app.post('/api/enroll/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            // ✅ එකම transactionId එක තියෙන ඔක්කොම SUCCESS කරන්න
            await prisma.enrollment.updateMany({
                where: { transactionId: session.id },
                data: { status: 'SUCCESS' }
            });
        } catch (dbError) {
            console.error('❌ Webhook DB Error:', dbError);
        }
    }
    res.json({received: true});
});

app.use(express.json());
// app.use(cors()); // 💡 Gateway එකේ CORS තියෙන නිසා මෙතන ඕනේ නැහැ

// ✅ 2. Eureka Config
const eurekaClient = new Eureka({
    instance: {
        app: 'enrollment-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${PORT}`,
        port: {'$': PORT, '@enabled': 'true'},
        vipAddress: 'enrollment-service',
        dataCenterInfo: {'@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo', name: 'MyOwn'},
    },
    eureka: {host: 'localhost', port: 8761, servicePath: '/eureka/apps/'},
});
eurekaClient.start((error) => {
    if (!error) console.log('✅ Registered with Eureka');
});

// --- ROUTES ---

// 1. Create Checkout
// enrollment-service ඇතුළත checkout API එක

app.post('/api/enroll/checkout', async (req, res) => {
    const { items, studentId } = req.body; // Array එකක් එනවා

    try {
        // 1. Stripe එකට items ටික map කරමු
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'lkr',
                product_data: { name: item.title },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: 1,
        }));

        // 2. Stripe Session එක හදමු
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:4200/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:4200/cart`,
        });

        // 3. 💡 වැදගත්ම දේ: හැම item එකකටම Enrollment එක බැගින් හදමු
        const enrollmentPromises = items.map(item => {
            return prisma.enrollment.create({
                data: {
                    studentId: Number(studentId),
                    courseId: Number(item.id),
                    amount: Number(item.price),
                    transactionId: session.id,
                    status: 'PENDING', // 👈 මුලින් PENDING දාමු
                    progressPercent: 0,
                    isCompleted: false
                }
            });
        });

        await Promise.all(enrollmentPromises);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: "Checkout failed" });
    }
});



// 3. Billing History (ඔයා ඇහපු අලුත් එක)
app.get('/api/enroll/billing/:studentId', async (req, res) => {
    const {studentId} = req.params;
    console.log(`📡 Request received for Billing: Student ID ${studentId}`);
    try {
        const history = await prisma.enrollment.findMany({
            where: {studentId: Number(studentId), status: 'SUCCESS'},
            orderBy: {createdAt: 'desc'}
        });

        const enrichedHistory = await Promise.all(history.map(async (item) => {
            try {
                const courseRes = await axios.get(`http://localhost:8082/courses/${item.courseId}`);
                return {
                    invoiceId: item.transactionId.substring(0, 12).toUpperCase(),
                    date: item.createdAt,
                    courseTitle: courseRes.data.title,
                    amount: item.amount,
                    status: item.amount > 0 ? 'Paid' : 'Free'
                };
            } catch (err) {
                return {
                    invoiceId: 'INV-' + item.id,
                    date: item.createdAt,
                    courseTitle: 'Unknown Course',
                    amount: item.amount,
                    status: 'Paid'
                };
            }
        }));
        res.json(enrichedHistory);
    } catch (error) {
        res.status(500).json({error: "Billing fetch error"});
    }
});

// enrollment-service ඇතුළත complete-lesson API එක
app.post('/api/enroll/complete-lesson', async (req, res) => {
    const {userId, courseId, lessonId, totalLessons} = req.body;

    // 💡 Safety Check: totalLessons නැතිනම් හෝ 0 නම් error එකක් දෙමු
    if (!totalLessons || totalLessons === 0) {
        return res.status(400).json({error: "Total lessons count is required and cannot be zero"});
    }

    try {
        await prisma.lessonProgress.upsert({
            where: {userId_lessonId: {userId: Number(userId), lessonId: Number(lessonId)}},
            update: {},
            create: {userId: Number(userId), lessonId: Number(lessonId), courseId: Number(courseId)}
        });

        const completedCount = await prisma.lessonProgress.count({
            where: {userId: Number(userId), courseId: Number(courseId)}
        });

        // ✅ දැන් මෙතන 0 කින් බෙදෙන්නේ නැහැ
        const progress = (completedCount / totalLessons) * 100;

        await prisma.enrollment.updateMany({
            where: {studentId: Number(userId), courseId: Number(courseId)},
            data: {progressPercent: progress, isCompleted: progress >= 100}
        });

        res.json({success: true, progress: progress});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
// index.js ඇතුළත

app.post('/api/enroll/confirm-payment', async (req, res) => {
    const { sessionId } = req.body;

    try {
        // 💡 මේ session ID එක තියෙන ඔක්කොම Enrollments 'SUCCESS' කරනවා
        const updateResult = await prisma.enrollment.updateMany({
            where: {
                transactionId: sessionId,
                status: 'PENDING' // දැනටමත් success වෙලා නැති ඒවා විතරක් කරන්න
            },
            data: { status: 'SUCCESS' }
        });

        res.json({ success: true, updatedCount: updateResult.count });
    } catch (error) {
        res.status(500).json({ error: "Failed to confirm payment" });
    }
});
app.get('/api/enroll/completed-lessons/:userId/:courseId', async (req, res) => {
    const {userId, courseId} = req.params;
    try {
        const completed = await prisma.lessonProgress.findMany({
            where: {
                userId: Number(userId),
                courseId: Number(courseId)
            },
            select: {lessonId: true} // අපිට ඕනේ lessonId ටික විතරයි
        });
        res.json(completed.map(c => c.lessonId));
    } catch (error) {
        res.status(500).json({error: "Fetch error"});
    }
});
// 2. Dashboard Enrollments (Updated)
app.get('/api/enroll/student/:studentId', async (req, res) => {
    const {studentId} = req.params;
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: {studentId: Number(studentId), status: 'SUCCESS'}
        });

        const enriched = await Promise.all(enrollments.map(async (enrol) => {
            try {
                const courseRes = await axios.get(`http://localhost:8082/courses/${enrol.courseId}`);
                return {
                    ...enrol,
                    courseTitle: courseRes.data.title,
                    courseThumbnail: courseRes.data.thumbnailUrl,
                    instructorName: courseRes.data.instructorName,
                    // 💡 දැන් DB එකේ තියෙන ඇත්තම progress එක මෙතනට එනවා
                    progressPercent: enrol.progressPercent
                };
            } catch (err) {
                return {...enrol, courseTitle: 'Unavailable'};
            }
        }));
        res.json(enriched);
    } catch (error) {
        res.status(500).json({error: "Fetch error"});
    }
});
// enrollment-service/index.js

app.get('/api/enroll/popular-ids', async (req, res) => {
    try {
        // Enrollment table එකේ courseId අනුව group කරලා count එක ගමු
        const popularGroups = await prisma.enrollment.groupBy({
            by: ['courseId'],
            _count: {
                courseId: true,
            },
            where: {
                status: 'SUCCESS' // සල්ලි ගෙවපු ඒවා විතරයි
            },
            orderBy: {
                _count: {
                    courseId: 'desc',
                },
            },
            take: 3, // වැඩිම 3ක්
        });

        // ලස්සනට IDs ටික විතරක් Array එකක් විදිහට යවමු [1, 5, 8]
        const ids = popularGroups.map(group => group.courseId);
        res.json(ids);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch popular IDs" });
    }
});

// 4. Check Status
app.get('/api/enroll/check/:studentId/:courseId', async (req, res) => {
    const {studentId, courseId} = req.params;
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            studentId: Number(studentId),
            courseId: Number(courseId),
            status: 'SUCCESS'
        }
    });
    res.json({enrolled: !!enrollment});
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 Enrollment Service running on port ${PORT}`);
});