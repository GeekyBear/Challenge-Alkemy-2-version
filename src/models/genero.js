const {DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('Genero',{
        nombre: {
            type: DataTypes.STRING
        },
        imagen: {
            type: DataTypes.STRING
        }
    })
}