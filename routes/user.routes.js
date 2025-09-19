const express = require('express');
const router = express.Router();

const userSignup = require('../controllers/user.signup');
const userLogin = require('../controllers/user.login');
const { sendOtp, verifyOtp } = require('../controllers/verify.email');
const { userAuthentication, userAuthorization } = require('../middlewares/user.auth');

const skillTest = require('../controllers/skill.test');
const submitTest = require('../controllers/submit.test');
const getTestReport = require('../controllers/get.test.report');

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/protected', userAuthentication, userAuthorization, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});

router.post('/skill-test', userAuthentication, userAuthorization, skillTest);
router.post('/submit-test', userAuthentication, userAuthorization, submitTest);
router.get('/test-report', userAuthentication, userAuthorization, getTestReport);


module.exports = router;