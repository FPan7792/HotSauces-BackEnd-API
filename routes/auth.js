const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router.post("/api/auth/signup", authControllers.signup);

router.post("/api/auth/login", authControllers.login);

module.exports = router;
