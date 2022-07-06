# CHALLENGE BACKEND - NodeJs 🚀
<h3>Objetivo</h3>
<p>Desarrollar una API para explorar el mundo de Disney, la cual permitirá conocer y modificar los
personajes que lo componen y entender en qué películas estos participaron. Por otro lado, deberá
exponer la información para que cualquier frontend pueda consumirla.</p>
<p>👉Utilizar NodeJs y Express.</p>
<p>👉No es necesario armar el Frontend.</p>
<p>👉Las rutas deberán seguir el patrón REST.</p>
<p>👉Utilizar la librería Sequelize.</p>

Requerimientos técnicos
<ul>
<li>Modelado de Base de Datos</li>
<li>Autenticación de Usuarios</li>
<li>Listado de Personajes</li>
<li>Creación, Edición y Eliminación de Personajes (CRUD)</li>
<li>Detalle de Personaje</li>
<li>Búsqueda de Personajes</li>
<li>Listado de Películas</li>
<li>Detalle de Película / Serie con sus personajes</li>
<li>Creación, Edición y Eliminación de Película / Serie</li>
<li>Búsqueda de Películas o Series</li>
<li>Envío de emails</li>
<li>Documentación: https://documenter.getpostman.com/view/21443721/UzJJtcJ5</li>
<li>Tests: Opcional. <b>No realizado</b></li>
</ul>

<h4>NOTAS:</h4>
<p>1) Para loguearse es necesario acceder al endpoint con alguno de los usuarios que estan en el array authUsers o con el que registren por el endpoint correspondiente</p>
<p>2) Para usar el sender de correos es necesario tener instalado: nodemailer, @sendgrid/mail y crear un dotenv (.env) con la Key pertinente, yo utilice el servicio de SenderGrid (https://www.youtube.com/watch?v=YPB-Mn_xY1E). Si no lo quieren usar puede comentar lo que esta en // Email configuration y la funcion sendMail del registro</p>
