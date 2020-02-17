var express = require("express");
var router = express.Router();
const connection = require("../config/db.js");

//para hacer SELECT en USER
// Ruta para ver TODOS los usuarios
router.get("/", function (req, res, next) {
    connection.query("SELECT * FROM user", (err, data) => {
        if (err) {
            throw err;
        } else {
            res.render("usersList", { data: data });
        }
        console.log(data);
    });
});

// Ruta para MOSTRAR (solo mostrar) el formulario de añadir usuario
router.get("/add", function (req, res, next) {
    res.render("addUser");
});



//para hacer INSERT en USER
// El submit del formulario, entra aquí para añadir un usario nuevo
router.post("/add", function (req, res) {
    let name = req.body.name;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    let is_admin = req.body.is_admin;

    connection.query(
        "INSERT INTO user set? ",
        { name, lastname, email, password, is_admin }, (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect("/");
        });
});


//para BORRAR, cuando yo borro un usuario se borra de la tabla productos todos los productos que 
//ha subido ese usuario.
router.get("/delete/:id_user", (req, res) => {
    let id = req.params.id_user;
    connection.query("DELETE  FROM user WHERE  id_user = " + id, function (err, result) {
        res.redirect("/users");
    });
});


//para EDITAR
router.get("/edit/:id_user", function (req, res) {
    console.log(req.params.id_user);
    let id_user = req.params.id_user;
    connection.query(
        "SELECT * FROM user WHERE id_user = ?", [id_user], (err, results) => {
            res.render("editUser", { results: results[0] });
            console.log(results);
        });
});


//para CUANDO MODIFICO LOS DATOS POST PARA ENVIARLOS.
router.post("/update/:id_user", function (req, res) {
    let id = req.params.id_user;
    let name = req.body.name;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    let is_admin = req.body.is_admin;

    connection.query(
        "UPDATE user set? WHERE id_user = " + id,
        { name, lastname, email, password, is_admin }, (err, results) => {
            res.redirect("/users");
        });
});



module.exports = router;
