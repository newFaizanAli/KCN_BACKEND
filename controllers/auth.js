const dotenv = require("dotenv")
dotenv.config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { users } = require('../schemas');
const { hashPassword, checkPassword } = require("../utilities/functions");
const { db } = require("../db");
const { eq } = require("drizzle-orm");
const { route } = require("../routes");
const { protect } = require("../middleware/auth");
const router = express.Router();


router.post("/register", async (req, res) => {
    try {

        const { name, email, password, status, role } = req.body

        if (!name || !email || !password || !role) {
            res.json({
                success: false,
                message: 'All fields are required'
            })
        }


        const hashedPassword = await hashPassword({ password })

        const [newUser] = await db.insert(users).values({ name, email, password: hashedPassword, status, role }).returning()


        res.json({ data: newUser, success: true })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await checkPassword({
            password,
            hashedPassword: user.password,
        });

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "60m",
                algorithm: "HS256",
            }
        );



        res.json({
            success: true,
            message: "Login successful",
            data: user,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});


router.get("/profile", protect, async (req, res) => {

    res.json({
        success: true,
        data: req.user
    });

});

module.exports = router;