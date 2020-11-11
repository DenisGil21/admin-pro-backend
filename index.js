require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config')

//Crear servidor express
const app = express();

//Base de datos
dbConnection();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());


//rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});