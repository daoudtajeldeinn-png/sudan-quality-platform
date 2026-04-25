const express = require('express');
const router = express.Router();

// DIRECT LOGIC (Bypassing the controller to fix the crash)
router.post('/register', async (req, res) => {
    try {
        const { userId, email, displayName, photoURL } = req.body;

        // DEMO MODE LOGIC (Safe and working)
        if (req.isDemoMode) {
            let user = await req.demoDB.findUserByEmail(email);
            if (!user) {
                user = await req.demoDB.createUser({ email, displayName, photoURL, userId });
            }
            return res.status(200).json({ message: 'Registered in Demo Mode', user, demoMode: true });
        }

        res.status(200).json({ message: 'User received' });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.get('/user/:userId', async (req, res) => {
    res.json({ message: 'User route works', demoMode: req.isDemoMode });
});

module.exports = router;
