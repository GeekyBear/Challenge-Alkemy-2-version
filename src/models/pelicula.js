const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('Pelicula',{
        titulo: {
            type: DataTypes.STRING
        },
        imagen: {
            type: DataTypes.STRING
        },
        fecha: {
            type: DataTypes.DATEONLY
        },
        puntaje: {
            type: DataTypes.INTEGER
        }
    })
}