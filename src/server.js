// Initial config of the server
const express = require('express');
const server = express();
const { db } = require('./models/modelos.js');
const session = require('express-session');
const { redirectLogin, redirectHome } = require('./redirects');
const { 
    listarPersonajes,
    crearPersonaje,
    obtenerPersonaje,
    actualizarPersonaje,
    borrarPersonaje,
    crearRelacion
 } = require('./functions/funcPersonaje');
const {
    listarPeliculas,
    crearPelicula,
    obtenerPelicula,
    actualizarPelicula,
    borrarPelicula,
    obtenerPeliculaPorNombre
} = require('./functions/funcPelicula')
const {
    obtenerPeliculaPorGenero
} = require('./functions/funcGenero')

// Email configuration
require('dotenv').config()
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendMail = async (msg) => {
    try {
        await sgMail.send(msg);
        console.log('Message sent succesfully')
    } catch (error) {
        console.log(error)
    }
}
// End Email config

// It allows me to pass the information from the login get to login post
server.use(express.urlencoded({extended:true}))

// It allows to give responses as json
server.use(express.json());


server.use(session(
    {
      name: 'sid',
      secret: 'secret', //It should be in an enviroment file
      resave: false,
      saveUninitialized: false,
      cookie:{
        maxAge: 1000 * 60 * 60 * 2 //2hs
      }
    }
))

const authUsers = [
    { id:1, name: 'Eze', email:'eze@gmail.com', password: '1234' },
    { id:2, name: 'Alo', email:'alo@gmail.com', password: '1234' }
]

server.get('/', redirectLogin, (req,res) => {
    res.send('Hola!')
})

// Home
server.get('/home', redirectLogin, (req,res) => {
    const user = authUsers.find(user => user.id === req.session.userId);
    res.send(`
    <h1>Bienvenido <span>${user.name}</span></h1>
    <p>Diviertete con nuestro backend</p>
    <p>Podes revisar la documentacion en este
    <a href='https://documenter.getpostman.com/view/21443721/UzBsGius'>link</a>
    <p><a href='/auth/logout'>SALIR</a></p>`)
})

// LOGIN GET
server.get('/auth/login', (req,res) =>{
    res.send(`
        <h1>Log in</h1>
        <form action="/auth/login" method="post">
            <section>
                <label for="username">Email</label>
                <input name="email" type="email" placeholder='Email' required autofocus>
            </section>
            <section>
                <label for="password">Password</label>
                <input name="password" type="password" placeholder='Password' required>
            </section>
            <button type="submit">Ingresar</button>
        </form>
    `)
})

// LOGIN POST
server.post('/auth/login', redirectHome, (req, res) => {
    console.log('entre al login')
    const { email, password } = req.body;
    if(email && password){
        const user = authUsers.find(user => user.email === email && user.password === password)
        console.log('encontre el user',user)
        if(user){
            req.session.userId = user.id;
            return res.redirect('/home');
      }
    }
    console.log('fail')
    res.redirect('/auth/login')
});

// REGISTER GET
server.get('/auth/register', (req,res) =>{
    res.send(`
        <h1>Registrar</h1>
        <form method='post' action='/auth/register'>
        <input name='name' placeholder='Name' required />
        <input type='email' name='email' placeholder='Email' required />
        <input type='password' name='password' placeholder='Password' required/>
        <input type='submit' />
        </form>
        <a href='/login'>Registrar cuenta</a>
    `)
})

// REGISTER POST
server.post('/auth/register', (req,res) =>{
    const { name, email, password } = req.body;
    sendMail(
        {
            to: email,
            from: 'ezegeek@gmail.com',
            subject: 'Cuenta registrada',
            text: 'Gracias por sumarse a nuestra aplicacion. Puede usar los endpoints libremente'
        }
    );
    let id = authUsers.length + 1
    authUsers.push({id, name,email,password})
    res.send(`name: ${name}, email: ${email}, password: ${password}`);
})

// LOGOUT
server.get('/auth/logout',redirectLogin, (req,res) => {
    req.session.destroy((err) => {
      if(err){
        return res.redirect('/home')
      }
      res.clearCookie('sid');
      res.redirect('/')
    })
})


//------------------<CRUD PERSONAJES>------------------\\
// LISTAR TODOS LOS PERSONAJES
// Si se pasa un NOMBRE devuelve ese personaje.
server.get('/characters', redirectLogin, async (req,res) =>{
    const {name, age, weigth, movies} = req.query;

    //Si no me llego un nombre
    if(!name){
        try {
            const characters = await listarPersonajes();
            return res.status(200).json({Personajes: characters});
        } catch(e) {
            console.log(e)
            res.sendStatus(500);
        }
    }

    try {
        const personajes = await obtenerPersonaje(name, age, weigth, movies);
        console.log('entreaca')
        
        res.status(200).json({Personajes: personajes});
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

// GET CHARACTER DETAIL - ¡¡¡¡OK!!!!
server.get('/characters/:name', redirectLogin, async (req, res, next) => {
    try {
      const { name } = req.params;
      const char = await obtenerPersonaje(name);
      if(!char[0]) return res.send('Character not found')
      res.json(char)
    } catch (e) {
      console.log(e);
      res.sendStatus(500);    
    }
})

// CREAR UN NUEVO PERSONAJE con la funcion crearPersonaje()
// Recibe nombre, imagen, edad, peso, historia por medio de req.body
server.post('/characters', redirectLogin, async (req,res) =>{
    try {
        const { nombre, imagen, edad, peso, historia, movieId } = req.body;
        const personaje = await crearPersonaje(nombre, imagen, edad, peso, historia, movieId)
        res.status(200).json({personaje})
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

// Tiene dos funciones
// 1) ASOCIAR PERSONAJE: Si se le pasa movieId e idPersonaje crea la asociación entre ellos
// util para agregar personajes a peliculas.
// 2) ACTUALIZAR PERSONAJE con la funcion actualizarPersonaje()
// Actualiza por "ID" (OJO) nombre, imagen, edad, peso, historia del personaje deseado
server.put('/characters', redirectLogin, async (req,res) => {
    const { id, nombre, imagen, edad, peso, historia, idPersonaje, movieId } = req.body;
    
    if(idPersonaje && movieId){
        try {
            const { idPersonaje, movieId } = req.body;
            const response = await crearRelacion(idPersonaje, movieId)
            return res.status(200).json({Respuesta: response})
        } catch(e) {
            console.log(e)
            return res.sendStatus(500);
        }
    }

    try {
        await actualizarPersonaje(id, nombre, imagen, edad, peso, historia)
        res.status(200).json({personaje: `Personaje ${nombre} actualizado`})
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

// BORRAR PERSONAJE con la funcion borrarPersonaje()
// Borra por "ID" (OJO) el personaje deseado
server.delete('/characters', redirectLogin, async (req,res) => {
    try {
        const { id } = req.body;
        console.log('id recibido: ', id)
        await borrarPersonaje(id)
        res.status(200).json({personaje: `Personaje eliminado`})
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

//-----------------</CRUD PERSONAJES>------------------\\

// LISTAR TODAS LAS PELICULAS | FILTRADO POR NOMBRE, GENERO y ORDEN
server.get('/movies', redirectLogin, async (req,res) =>{
    const {name, genre, order } = req.query;

    //Si me llego un genero, listo todas las peliculas que encuentre por genero!
    if(genre) {
        try {
            console.log('entre donde no debia')
            const genero = await obtenerPeliculaPorGenero(genre);
            return res.status(200).json({genero});
        } catch(e) {
            console.log(e)
            res.sendStatus(500);
        }
    }

    // Listo las peliculas en el orden deseado
    if(order){
        try {
            const peliculas = await listarPeliculas(order);
            return res.status(200).json({Peliculas: peliculas});
        } catch(e) {
            console.log(e)
            res.sendStatus(500);
        }
    }
    
    //Si no me llego un nombre listo las peliculas como vienen
    if(!name){
        try {
            const peliculas = await listarPeliculas();
            return res.status(200).json({Peliculas: peliculas});
        } catch(e) {
            console.log(e)
            res.sendStatus(500);
        }
    }

    // Si me llego un nombre obtengo la pelicula por nombre!
    try {
        const peliculas = await obtenerPeliculaPorNombre(name);        
        res.status(200).json({Peliculas: peliculas});
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

// OBTENER PELICULA CON SUS PERSONAJES
server.get('/movies/:movieId', redirectLogin, async (req, res, next) => {
    try {
      const { movieId } = req.params;
      const pelicula = await obtenerPelicula(movieId);
      if(!pelicula[0]) return res.send('Pelicula no encontrada')
      res.json(pelicula)
    } catch (e) {
      console.log(e);
      res.sendStatus(500);    
    }
})

// CREAR UNA NUEVA PELICULA
server.post('/movies', redirectLogin, async (req,res) =>{
    try {
        const { titulo, imagen, fecha, puntaje, genero } = req.body;
        const pelicula = await crearPelicula(titulo, imagen, fecha, puntaje, genero)
        res.status(200).json({pelicula})
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

// ACTUALIZAR UNA PELICULA
server.put('/movies', redirectLogin, async (req,res) => {
    try {
        const { movieId, titulo, imagen, fecha, puntaje } = req.body;
        console.log(movieId, titulo, imagen, fecha, puntaje)
        const respuesta = await actualizarPelicula(movieId, titulo, imagen, fecha, puntaje)
        if(respuesta == 0) return res.status(200).send('No existe una pelicula con ese movieId')
        res.status(200).json({personaje: `Pelicula-Serie ${titulo} actualizada`})
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

// BORRAR UNA PELICULA
server.delete('/movies', redirectLogin, async (req,res) => {
    try {
        const { movieId } = req.body;
        const respuesta = await borrarPelicula(movieId)
        if(respuesta == 0) return res.status(200).json({ respuesta: 'No existe una pelicula con ese movieId' })
        res.status(200).json({personaje: `Pelicula-Serie eliminado`})
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
})

module.exports = { server };