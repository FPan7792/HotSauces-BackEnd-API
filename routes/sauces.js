const express = require("express");
const router = express.Router();
const saucesControllers = require("../controllers/sauces");

// MIDDLEWARES
const isAuthorized = require("../middlewares/isAuthorized");
const multer = require("../middlewares/multer-config");

// GET ALL
router.get("/api/sauces", isAuthorized, saucesControllers.getAllSauces);
// FIND ONE
router.get("/api/sauces/:id", isAuthorized, saucesControllers.getOneSauce);

// CREATE
router.post("/api/sauces", isAuthorized, multer, saucesControllers.createSauce);

// MODIFY
router.put(
  "/api/sauces/:id",
  isAuthorized,
  multer,
  saucesControllers.modifySauce
);

// DELETE
router.delete("/api/sauces/:id", isAuthorized, saucesControllers.deleteSauce);

// LIKES / DISLIKES
router.post(
  "/api/sauces/:id/like",
  isAuthorized,
  saucesControllers.appreciateSauce
);

module.exports = router;
