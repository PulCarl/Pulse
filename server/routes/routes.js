import express from 'express';
import { signup, login, isAuth } from '../controllers/auth.js';

const router = express.Router();

// Route pour la connexion d'un utilisateur
router.post('/login', login);

// Route pour l'inscription d'un utilisateur
router.post('/signup', signup);

// Route pour l'accès à une ressource privée (nécessite une authentification)
router.get('/private', isAuth);

// Route pour l'accès à une ressource publique (non authentifiée)
router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

// Route pour toutes les autres requêtes qui ne correspondent à aucune des routes précédentes
router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});

export default router;
