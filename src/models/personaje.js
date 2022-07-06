const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('Personaje',{
        nombre: {
            type: DataTypes.STRING
        },
        imagen: {
            type: DataTypes.STRING
        },
        edad: {
            type: DataTypes.INTEGER
        },
        peso: {
            type: DataTypes.INTEGER
        },
        historia: {
            type: DataTypes.STRING
        }
    })
}