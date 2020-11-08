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


//rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'hola mundo'
    })
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});