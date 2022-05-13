const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router.post("/api/auth/signup", authControllers.signup);

// Installer le MIDDLEWARE POUR la securisation des datas
router.post("/api/auth/login", authControllers.login);

// router.post("/", isAuthenticated);

module.exports = router;
