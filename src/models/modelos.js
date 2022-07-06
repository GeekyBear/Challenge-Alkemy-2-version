const { Sequelize, Op } = require('sequelize');
const modeloPersonaje = require('./personaje');
const modeloPelicula = require('./pelicula');
const modeloGenero = require('./genero');

const db = new Sequelize('postgres://postgres:H3adsh0t@localhost:5432/disney')
db.sync({ force: true })

modeloPersonaje(db);
modeloPelicula(db);
modeloGenero(db);

module.exports = {
    ...db.models,
    db,
    Op
}