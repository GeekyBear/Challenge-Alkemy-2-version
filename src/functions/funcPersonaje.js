const { db } = require('../models/modelos');
const { Personaje, Pelicula } = db.models;

Personaje.belongsToMany(Pelicula, {through: 'Personaje_Pelicula'});

// LISTAR PERSONAJES
async function listarPersonajes () {
    const lista = await Personaje.findAll({
        attributes: ['nombre','imagen']
    })
    if(lista.length === 0) return 'No hay personajes cargados'
    return lista;
}

// CREAR PERSONAJES
async function crearPersonaje(nombre, imagen, edad, peso, historia, movieId) {
    // Reviso si el personaje ya exixste
    const buscarPersonaje = await Personaje.findAll({
        where: {
            nombre: nombre
        }
    })

    // Sino lo encontre devuelvo un mensaje diciendo que ya existe
    if(buscarPersonaje.length !== 0){
        return 'El personaje ya existe'
    } 

    // Reviso si la pelicula a la que voy a agregar el personaje existe
    const buscarPelicula = await Pelicula.findAll({
        where: {
            id: movieId
        }
    })

     // Si no encontre, solo hago un return avisando que no existe y que no se puede agregar el personaje
    if(buscarPelicula.length === 0){
        return 'Ya pelicula a la que intentas agregar el personaje no existe'
    }
        
    // Crea un personaje en la base de datos
    const personaje = await Personaje.create({
        nombre, 
        imagen, 
        edad, 
        peso, 
        historia
    })

     // Si la busqueda de pelicula existe creo la asociacion
     if(buscarPelicula.length !== 0){
        await personaje.addPelicula(buscarPelicula)
        return 'Personaje creado correctamente'
    } 
    
    return 'No se pudo agregar el personaje'
}

// ACTUALIZAR PERSONAJE POR ID
async function actualizarPersonaje(id, nombre, imagen, edad, peso, historia){
    const personaje = await Personaje.update({nombre, imagen, edad, peso, historia}, 
        { where: {id: id}});
        
    //Retorna el personaje actualizado?
    return personaje
}

async function crearRelacion(idPersonaje, movieId){
    const pelicula = await Pelicula.findOne({
        where: {
            id: movieId
        }
    })

    if(pelicula.length === 0){
        return 'Pelicula inexistente'
    } 

    const personaje = await Personaje.findOne({
        where: {
            id: idPersonaje
        }
    })

    if(personaje.length === 0){
        return 'Personaje inexistente'
    } 

    await pelicula.addPersonaje(personaje);
    return `Se agrego el ${personaje.nombre} a la pelicula ${pelicula.titulo}`
}

// BORRAR PERSONAJES
async function borrarPersonaje(id) {
    console.log('id dentro de la funcion', id)
    await Personaje.destroy({
        where: {
            id: id
        },
    });
}
    
// OBTENER PERSONAJE POR NOMBRE
async function obtenerPersonaje(nombre, edad, peso, peliculas){
    // Almaceno el where con las propiedades recibidas
    var where = { nombre, edad, peso, peliculas}
    
    // Si alguna esta vacia la limpio :D
    Object.keys(where).forEach(key => {
        if (!where[key]) {
          delete where[key];
        }
    });

    const personaje = await Personaje.findAll({
        where,
        include: [
            { model: Pelicula }
        ]
    })
    return personaje;
}

module.exports = {
    // <EXPORTS DE PERSONAJE>
    listarPersonajes,
    crearPersonaje,
    obtenerPersonaje,
    actualizarPersonaje,
    borrarPersonaje,
    crearRelacion
}