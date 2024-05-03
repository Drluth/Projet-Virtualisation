module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false // Assurez-vous que l'ID ne peut pas être NULL
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false // Ajout de NOT NULL sur fullname
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false // Assurez-vous que l'email ne peut pas être NULL si nécessaire
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false // Ajout de NOT NULL sur password
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false // Ajout de NOT NULL sur phoneNumber
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fileUpload: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false // Ajout de NOT NULL sur fileUpload
    },
    photo: {
      unique: true,
      type: DataTypes.STRING, // Utilisation de BLOB pour stocker les fichiers d'image
      allowNull: false // Ajout de NOT NULL sur photo
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now')
    }
  }, {
    tableName: 'User'
  });
};
