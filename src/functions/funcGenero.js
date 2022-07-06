const { db } = require('../models/modelos');
const { Pelicula, Genero } = db.models;

Genero.belongsToMany(Pelicula, {through: 'Pelicula_Genero'});

async function obtenerPeliculaPorGenero(genre){
    // Almaceno el where con las propiedades recibidas
    const genero = await Genero.findOne({
        where: {
            nombre: genre
        },
        include: [
            { model: Pelicula }
        ]
    })

    if(!genero) return 'No existe el genero buscado'

    return genero;
}

module.exports = {
    obtenerPeliculaPorGenero
}