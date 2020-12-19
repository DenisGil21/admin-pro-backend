const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        //Verificar contrasena
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contrasena no valida'
            });
        }

        //Generar el TOKEN -jwt
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const googleSingIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });

        let usuario;
        if (!usuarioDB) {
            //si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            //si no cambia contrasena tendra los dos metodos de autenticacion
            // usuario.password = '@@@';

        }

        //Guardar en DB
        await usuario.save();

        //Generar el TOKEN -jwt
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'token no es correcto'
        });
    }

}


const renewToken = async(req, res = response) => {

    const uid = req.uid;

    //Generar el TOKEN -jwt
    const token = await generarJWT(uid);

    //Obtener usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });
}


module.exports = {
    login,
    googleSingIn,
    renewToken
}