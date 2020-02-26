var express = require("express");
var router = express.Router();
const connection = require("../config/db.js");



//para acceder a la pantalla que verifica el usuario y la contraseña
router.get("/", function (req, res, next) {
    res.render("login", { error: "", is_admin: "0", user: {} });
});


// select a la tabla user para saber si ese usuario esta en base de datos
router.post('/', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], function (error, results) {
            console.log("el resultado de la consulta", results);
            if (results.length > 0) {
                //recupero los datos del usuario de login
                let id_user = results[0].id_user;
                let name = results[0].name;
                let lastname = results[0].lastname;
                let email = results[0].email;
                //establezco los valores en la sesion
                req.session.is_admin = results[0].is_admin;
                req.session.user = { name, lastname, email, id_user };
                //cargo la pagina que yo quiero enviandole de vuelta a products estos datos
                res.render('index', { is_admin: req.session.is_admin, user: req.session.user, error: "" });
            } else {

                res.render('login', { error: "Incorrect email and/or Password!" });

            }
            res.end();
        });
    } else {
        res.render('login', { error: "vuelve a introducir tu email y/o password" });
        res.end();
    }
});



module.exports = router;