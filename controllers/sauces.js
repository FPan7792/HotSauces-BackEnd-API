const Sauce = require("../models/Sauce");

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

      // console.log("NEWSAUCE", newSauce);
      delete newSauce._id;
      await newSauce.save();

      res
        .status(200)
        .json({ message: "Nouvelle sauce enregistrée !", SAUCE: newSauce });
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(404).send("Erreur: Champs manquants");
};

exports.modifySauce = async (req, res) => {
  const { id } = req.params;

  if (req.body) {
    try {
      let sauceToModify = {};
      if (req.file) {
        sauceToModify = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
      } else sauceToModify = { ...req.body };

      await Sauce.updateOne({ _id: id }, { ...sauceToModify, _id: id });
      res.status(200).json({ message: "Sauce effacée", SAUCE: sauceToModify });
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(404).send("Erreur: Champs manquants");
};

exports.deleteSauce = async (req, res) => {
  // console.log("PARAMS", req.params);
  const { id } = req.params;

  if (id) {
    try {
      const searchedSauce = await Sauce.findOne({ _id: id });

      await searchedSauce.delete();
      res.status(200).json({ message: "Sauce effacée", SAUCE: searchedSauce });
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(404).send("Erreur: Id requis");
};

exports.appreciateSauce = async (req, res) => {
  const { userId, like } = req.body;
  const { id } = req.params;

  if (req.body) {
    try {
      const targetedSauce = await Sauce.findOne({ id });

      // console.log("TS", targetedSauce);

      switch (like) {
        case 1:
          targetedSauce.usersDisliked = removeElementfromSpecificArray(
            targetedSauce.usersDisliked,
            userId
          );
          targetedSauce.usersLiked.push(userId);
          break;

        case -1:
          targetedSauce.usersLiked = removeElementfromSpecificArray(
            targetedSauce.usersLiked,
            userId
          );
          targetedSauce.usersDisliked.push(userId);
          break;

        case 0:
          targetedSauce.usersLiked = removeElementfromSpecificArray(
            targetedSauce.usersLiked,
            userId
          );
          targetedSauce.usersDisliked = removeElementfromSpecificArray(
            targetedSauce.usersDisliked,
            userId
          );
          break;
        default:
          targetedSauce;
          break;
      }

      targetedSauce.likes = targetedSauce.usersLiked.length;
      targetedSauce.dislikes = targetedSauce.usersDisliked.length;

      await Sauce.findByIdAndUpdate(
        { _id: id },
        {
          likes: targetedSauce.likes,
          dislikes: targetedSauce.dislikes,
          usersDisliked: targetedSauce.usersDisliked,
          usersLiked: targetedSauce.usersLiked,
        }
      );

      res
        .status(200)
        .json({ message: "Sauce likée ou dislikée", SAUCE: targetedSauce });
    } catch (e) {
      console.error(e);
      res.status(400).send(e.message);
    }
  } else res.status(404).send("Erreur: Champs manquants");
};

async function removeElementfromSpecificArray(tab, idOfAGivenUser) {
  const searchedUser = await tab.findIndex((elem) => elem === idOfAGivenUser);

  if (searchedUser !== -1) {
    const newTab = tab.splice(searchedUser, 1);
    return newTab;
  }

  return tab;
}