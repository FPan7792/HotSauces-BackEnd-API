const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.getAllSauces = async (req, res) => {
  try {
    const allSauces = await Sauce.find();

    res.status(200).json(allSauces);
  } catch (e) {
    console.error(e);

    res.status(404).send("Aucune liste disponible ");
  }
};

exports.getOneSauce = async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      const searchedSauce = await Sauce.findOne({ _id: id });
      res.status(200).json(searchedSauce);
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(404).send("Error: Id required");
};

exports.createSauce = async (req, res) => {
  if (req.body) {
    try {
      const sauce = JSON.parse(req.body.sauce);

      const newSauce = await new Sauce({
        ...sauce,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });

      await newSauce.save();

      res
        .status(201)
        .json({ message: "Nouvelle sauce enregistrée !", Sauce: newSauce });
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(404).send("Erreur: Champs manquants");
};

exports.modifySauce = async (req, res) => {
  const { id } = req.params;

  const targetedSauce = await Sauce.findOne({ _id: id });
  let formerImage = targetedSauce.imageUrl.split("/images/")[1];
  console.log("FORMER IMAGE", formerImage);

  if (req.body) {
    try {
      if (req.file) {
        const sauce = JSON.parse(req.body.sauce);

        let sauceToModify = {
          ...sauce,
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
        fs.unlink(`images/${formerImage}`, () => {
          console.log("Image Unlinked");
        });

        await Sauce.findByIdAndUpdate({ _id: id }, sauceToModify);
        res.status(200).json({ message: "Sauce Modifiée" });
      } else {
        let sauceToModify = { ...req.body };

        await Sauce.findByIdAndUpdate({ _id: id }, sauceToModify);
        res.status(200).json({ message: "Sauce Modifiée" });
      }
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(400).send("Erreur: Champs manquants");
};

exports.deleteSauce = async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      const searchedSauce = await Sauce.findOne({ _id: id });

      const filename = searchedSauce.imageUrl.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        searchedSauce.delete();
      });

      res.status(200).json({ message: "Sauce effacée" });
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(400).send("Erreur: Id requis");
};

exports.appreciateSauce = async (req, res) => {
  const { userId, like } = req.body;
  const { id } = req.params;

  if (req.body) {
    try {
      const targetedSauce = await Sauce.findOne({ id });
      let { usersLiked, usersDisliked } = targetedSauce;

      if (like === 1) {
        if (!usersLiked.find((elem) => elem === userId)) {
          usersLiked.push(userId);

          const elemToRemove = usersDisliked.findIndex(
            (elem) => elem === userId
          );
          if (elemToRemove !== -1) {
            usersDisliked.splice(elemToRemove, 1);
          }
        }
      } else if (like === -1) {
        if (!usersDisliked.find((elem) => elem === userId)) {
          usersDisliked.push(userId);

          const elemToRemove = usersLiked.findIndex((elem) => elem === userId);
          if (elemToRemove !== -1) {
            usersLiked.splice(elemToRemove, 1);
          }
        }
      } else if (like === 0) {
        const elemToRemovefromLiked = usersLiked.findIndex(
          (elem) => elem === userId
        );
        if (elemToRemovefromLiked !== -1) {
          usersLiked.splice(elemToRemovefromLiked, 1);
        }

        const elemToRemovefromDisliked = usersDisliked.findIndex(
          (elem) => elem === userId
        );
        if (elemToRemovefromDisliked !== -1) {
          usersDisliked.splice(elemToRemovefromDisliked, 1);
        }
      }

      let newSauce = {
        likes: usersLiked.length,
        dislikes: usersDisliked.length,
        usersLiked,
        usersDisliked,
      };

      await Sauce.findByIdAndUpdate({ _id: id }, newSauce);

      res.status(200).json({ message: "Sauce likée ou dislikée" });
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(400).send("Erreur: Champs manquants");
};
