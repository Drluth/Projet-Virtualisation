// Définition du modèle OTP
module.exports = function (sequelize, DataTypes) {
  const OTP = sequelize.define('OTP', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false 
    },
    otp: DataTypes.STRING,
    expiration_time: DataTypes.DATE,
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    userId: { // Clé étrangère pour référencer l'utilisateur associé
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'OTP'
  });

  OTP.associate = (models) => {
    OTP.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return OTP; 
  
};
