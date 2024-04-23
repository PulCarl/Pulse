import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const signup = (req, res, next) => {
  // Vérifie si l'email existe déjà
  User.findOne({ where: { email: req.body.email } })
    .then(dbUser => {
      if (dbUser) {
        return res.status(409).json({ message: "L'e-mail existe déjà" });
      } else if (req.body.email && req.body.password) {
        // Vérifie si l'email contient "@"
        if (!req.body.email.includes("@")) {
          return res.status(400).json({ message: "Format d'email non valide" });
        }
        // Hash du mot de passe
        bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
          if (err) {
            return res.status(500).json({ message: "Could not hash the password" });
          } else if (passwordHash) {
            return User.create({
              email: req.body.email,
              name: req.body.name,
              password: passwordHash,
              phoneNumber: req.body.phoneNumber, // Ajout du numéro de téléphone
            })
              .then(() => {
                res.status(200).json({ message: "Inscription réussie" });
              })
              .catch(err => {
                console.log(err);
                res.status(502).json({ message: "Erreur lors de la création de l'utilisateur" });
              });
          }
        });
      } else if (!req.body.password) {
        return res.status(400).json({ message: "Mot de passe non fourni" });
      } else if (!req.body.email) {
        return res.status(400).json({ message: "Email non fourni" });
      }
    })
    .catch(err => {
      console.log('Error', err);
    });
};

const login = (req, res, next) => {
  // Vérifie si l'email existe
  User.findOne({ where: { email: req.body.email } })
    .then(dbUser => {
      if (!dbUser) {
        return res.status(404).json({ message: "UUtilisateur non trouvé" });
      } else {
        // Vérifie si l'email contient "@"
        if (!req.body.email.includes("@")) {
          return res.status(400).json({ message: "Format d'email non valide" });
        }

        // Comparaison du mot de passe
        bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
          if (err) { // Erreur lors de la comparaison
            res.status(502).json({ message: "Erreur lors de la vérification du mot de passe de l'utilisateur" });
          } else  if (compareRes) { // Mot de passe correspondant
            const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });
            res.status(200).json({ message: "User logged in", "token": token });
          } else { // Mot de passe ne correspond pas
            res.status(401).json({ message: "Invalid credentials" });
          }
        });
      }
    })
    .catch(err => {
      console.log('Error', err);
    });
};

const isAuth = (req, res, next) => {
  const authHeader = req.get("Autorisation");
  if (!authHeader) {
    return res.status(401).json({ message: 'Non authentifié' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Impossible de décoder le jeton' });
  }
  if (!decodedToken) {
    res.status(401).json({ message: 'Non autorisé' });
  } else {
    const { email } = decodedToken;
    User.findOne({ where: { email } })
      .then(dbUser => {
        if (dbUser) {
          res.status(200).json({ message: 'Voici votre ressource', name: dbUser.name });
        } else {
          res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
      })
      .catch(err => {
        console.log('Error', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  }
};




export { signup, login, isAuth };