// gestion du web token
const jwt = require("jsonwebtoken");

// middleware d'authentification TOKEN
const isAuthorized = async (req, res, next) => {
  const getAuthorization = req.headers.authorization.replace("Bearer ", "");

  if (getAuthorization) {
    try {
      await jwt.verify(
        getAuthorization,
        "6c412ab29876412b84949998991358aa",
        (e, decoded) => {
          if (e) {
            throw e;
          }
          // console.log("DECODED1", decoded);
          const parsedToken = decoded.userId;

          if (req.body.userId && parsedToken !== req.body.userId) {
            console.log("Données d'acces incorrect");
            throw new Error(
              "Données d'acces incorrect. modifications impossibles"
            );
          } else {
            req.body.userId = decoded.userId;
            if (req.body.sauce) {
            }
            // console.log("Accès autorisé");
            next();
          }
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(400).send(error.message);
    }
  } else {
    res.status(401).send("Entête de requètes manquantes");
  }
};

module.exports = isAuthorized;
