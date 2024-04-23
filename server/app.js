import express from 'express';
import sequelize from './utils/database.js';
import router from './routes/routes.js';
import cors from 'cors';

const app = express();

// Middleware pour gérer les données de formulaire
app.use(express.urlencoded({ extended: true }));

// Middleware pour parser les données JSON
app.use(express.json());

// Middleware pour gérer les requêtes CORS
app.use(cors());

// Middleware pour gérer les en-têtes CORS
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Utilisation du routeur défini dans le fichier "routes.js"
app.use(router);

// Synchronisation de la base de données avec les modèles Sequelize
sequelize.sync()
    .then(() => console.log("Connexion à la BDD"))
    .catch(Error => console.log(Error));

// Démarrage du serveur Express sur le port 8080
app.listen(8080, () => console.log("Port 8080"));
