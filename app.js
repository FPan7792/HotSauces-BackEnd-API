const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Connexion à la BDD MONGO
mongoose.connect(
  `mongodb+srv://FPan7792:${process.env.MONGODBPASSWORD}@fpreactdb.3za4w.mongodb.net/hot_sauces?authSource=admin&replicaSet=atlas-vhk3x3-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error("Connexion à MongoDB échouée !", err.message);
    } else {
      console.log("Connexion à MongoDB réussie !");
    }
  }
);

// initialisation d'entetes
app.use(cors());

// conversion des données en JSON
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

// Impoort de l'ensemble des routes
const authRoutes = require("./routes/auth");
const saucesRoutes = require("./routes/sauces");

// Utilisation des routes
app.use(authRoutes);
app.use(saucesRoutes);

// si Route inexistante
app.all("*", (req, res) => {
  res.status(404).send("Page non trouvée");
});

module.exports = app;
