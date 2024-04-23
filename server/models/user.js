import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';

const User = sequelize.define('users', {
   userID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   name: {
      type: Sequelize.STRING,
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   typeID: {
      type: Sequelize.STRING,
      defaultValue: 'client', // Valeur par défaut pour le champ typeID
   },
}, {
   timestamps: false // désactiver les champs createdAt et updatedAt
});

export default User;
