// MODELE MONGO
const User = require("../models/User");

// sécurisation des mots de passe
const argon2 = require("argon2");

// generation d'un webToken
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      argon2
        .hash(password, {
          type: argon2.argon2id,
          hashLength: 16,
        })
        .then((hash) => {
          const newUser = new User({ email, password: hash });

          newUser
            .save()
            .then(() => {
              // console.log("Voici le nouvel USER", newUser);
              return res
                .status(201)
                .json({ message: "Nouveau USER créé avec success", newUser });
            })
            .catch((e) => res.status(400).send(e.message));
        });
    } catch (e) {
      console.log(e.message);
      res.status(400).json(e.message);
    }
  } else res.status(400).send("ERREUR: Champs manquants");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    User.findOne({ email })
      .then((targetedUser) => {
        if (!targetedUser) {
          res.status(400).send("Aucun utlisateur ne réponds à votre recherche");
        } else {
          argon2
            .verify(targetedUser.password, password)
            .then((match) => {
              if (match) {
                return res.status(200).json({
                  userId: targetedUser.id,
                  token: jwt.sign(
                    { userId: targetedUser._id },
                    "6c412ab29876412b84949998991358aa",
                    {
                      expiresIn: "24h",
                    }
                  ),
                });
              } else {
                console.log("Accès refusé");
                res.status(401).send("Mauvais email ou password");
              }
            })
            .catch((e) => {
              console.error(e.message);
              res.status(400).send(e.message);
            });
        }
      })
      .catch((e) => console.log(e.message));
  } else res.status(400).send("ERREUR: Champs manquants");
};
