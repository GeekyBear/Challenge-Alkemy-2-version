const { db } = require('../models/modelos');
const { Personaje, Pelicula, Genero } = db.models;

Pelicula.belongsToMany(Personaje, {through: 'Personaje_Pelicula'});
Pelicula.belongsToMany(Genero, {through: 'Pelicula_Genero'});

async function listarPeliculas (order) {
    if(order){
        const listaPeliculas = await Pelicula.findAll({
            attributes: ['titulo','imagen', 'fecha'],
            order: [["fecha", order]],
        })
        return listaPeliculas;
    }

    const listaPeliculas = await Pelicula.findAll({
        attributes: ['titulo','imagen', 'fecha']
    })
    return listaPeliculas;
}

async function crearPelicula(titulo, imagen, fecha, puntaje, genero) {  
    // Reviso si la pelicula existe
    const buscarPelicula = await Pelicula.findAll({
        where: {
            titulo: titulo
        }
    })
    
    // Si la encontre, solo hago un return avisando que ya existe.
    if(buscarPelicula.length !== 0){
        // ¿Debería actualizar la pelicula con nueva info aca? Podría usar un update.
        return 'Ya existe la pelicula que intentas ingresar'
    } 
    
    const pelicula = await Pelicula.create({
        titulo,
        imagen,
        fecha, 
        puntaje,
    })

    // Reviso si el genero existe
    const buscarGenero = await Genero.findAll({
        where: {
            nombre: genero
        }
    })
    
    // Si la busqueda devuelve vacio, creo el genero
    if(buscarGenero.length !== 0){
        await pelicula.addGenero(buscarGenero)
        return 'Pelicula creada correctamente'
    } else {
        //Sino devuelvo la pelicula
        await pelicula.createGenero({
            nombre: genero,
        })
        return pelicula
    }


    return 'Error: No deberias haber llegado aqui'
}

async function obtenerPelicula(id){
    const pelicula = await Pelicula.findAll({
        where: {
            id
        },
        include: [
            { model: Personaje }
            ]
    })
    //const personajes = await pelicula.getPersonajes()

    
    return pelicula


}

// REVISAR QUE PASA CUANDO NO HAY MOVIE ID
async function actualizarPelicula(movieId, titulo, imagen, fecha, puntaje){
    if(!obtenerPelicula(movieId)) return { respuesta: 'No existe una pelicula con ese movieId' }
    const peliculaActualizada = await Pelicula.update({titulo, imagen, fecha, puntaje}, 
        { where: {id: movieId}});
    return peliculaActualizada;
}

// BORRA LA PELICULA SELECCIONADA
async function borrarPelicula(movieId) {
    if(!obtenerPelicula(movieId)) return
    const peliculaBorrada = await Pelicula.destroy({
        where: {
            id: movieId
        },
    });
    return peliculaBorrada;
}

// Obtener pelicula por nombre con una query
async function obtenerPeliculaPorNombre(name){
    // Almaceno el where con las propiedades recibidas
    const movie = await Pelicula.findAll({
        where: {titulo: name}
    })
    return movie;
}

module.exports = {
    listarPeliculas,
    crearPelicula,
    obtenerPelicula,
    actualizarPelicula,
    borrarPelicula,
    obtenerPeliculaPorNombre
}

/*
// OK
async function queryMovByName(name){
    const movie = await Movie.findAll({
        where: {
            title: name
        }
    })
    return movie;
}

// OK
async function queryMovByIdGenre(idGenero){
    let genre = await Genre.findAll({
        where: {
            id: idGenero
        }
    })

    if(genre.length !== 0){
        const moviesByGenre = await genre[0].getMovies()
        //movieChars.map(char => console.log(char.toJSON()))
        return moviesByGenre
    } else {
        return 'The Genre has no movies';
    }
}


// OK
async function queryMovByOrder(ord){
    const allMovies = await Movie.findAll({
        attributes: ['image','title', 'date'],
        order: [["date", ord]],
        //,
        //order: [null, 'date', 'DESC']
    })
    
    return allMovies;
}

*/